package user_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@Configuration
public class DatabaseInitializer {

    @Value("${spring.datasource.url}")
    private String defaultDbUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    @Primary // Make this the primary datasource
    public DataSource dataSource() {
        // 1. First check/create the users database
        DataSourceBuilder<?> initialDataSource = DataSourceBuilder.create()
                .url(defaultDbUrl)
                .username(username)
                .password(password);

        try (Connection conn = initialDataSource.build().getConnection()) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(initialDataSource.build());

            // Check if users DB exists
            if (!jdbcTemplate.queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'users')",
                    Boolean.class)) {
                jdbcTemplate.execute("CREATE DATABASE users");
                System.out.println("Database 'users' created successfully");
            }

            // Initialize schema in users DB
            String usersDbUrl = defaultDbUrl.replaceFirst("/[^/]+$", "/users");
            DataSource usersDataSource = DataSourceBuilder.create()
                    .url(usersDbUrl)
                    .username(username)
                    .password(password)
                    .build();

            try (Connection usersConn = usersDataSource.getConnection()) {
                ScriptUtils.executeSqlScript(usersConn, new ClassPathResource("schema.sql"));
                System.out.println("Schema initialized successfully in 'users' database");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Database initialization failed", e);
        }

        // 2. Return the datasource that points to users DB
        String usersDbUrl = defaultDbUrl.replaceFirst("/[^/]+$", "/users");
        return DataSourceBuilder.create()
                .url(usersDbUrl)
                .username(username)
                .password(password)
                .build();
    }
}