package event_service.config;

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
        // 1. First check/create the events database
        DataSourceBuilder<?> initialDataSource = DataSourceBuilder.create()
                .url(defaultDbUrl)
                .username(username)
                .password(password);

        try (Connection conn = initialDataSource.build().getConnection()) {
            JdbcTemplate jdbcTemplate = new JdbcTemplate(initialDataSource.build());

            // Check if events DB exists
            if (!jdbcTemplate.queryForObject(
                    "SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'events')",
                    Boolean.class)) {
                jdbcTemplate.execute("CREATE DATABASE events");
                System.out.println("Database 'events' created successfully");
            }

            // Initialize schema in events DB
            String eventsDbUrl = defaultDbUrl.replaceFirst("/[^/]+$", "/events");
            DataSource eventsDataSource = DataSourceBuilder.create()
                    .url(eventsDbUrl)
                    .username(username)
                    .password(password)
                    .build();

            try (Connection eventsConn = eventsDataSource.getConnection()) {
                ScriptUtils.executeSqlScript(eventsConn, new ClassPathResource("schema.sql"));
                System.out.println("Schema initialized successfully in 'events' database");
            }
        } catch (SQLException e) {
            throw new RuntimeException("Database initialization failed", e);
        }

        // 2. Return the datasource that points to events DB
        String eventsDbUrl = defaultDbUrl.replaceFirst("/[^/]+$", "/events");
        return DataSourceBuilder.create()
                .url(eventsDbUrl)
                .username(username)
                .password(password)
                .build();
    }
}