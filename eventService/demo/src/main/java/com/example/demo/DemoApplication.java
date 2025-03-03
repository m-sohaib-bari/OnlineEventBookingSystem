package com.example.demo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.Map;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		System.out.println("Start of spring boot project.");

		// Load .env file
		Dotenv dotenv = Dotenv.load();
		Map<String, String> env = System.getenv();

		// Set environment variables for Spring Boot
		System.setProperty("POSTGRES_DB_URL", dotenv.get("POSTGRES_DB_URL"));
		System.setProperty("POSTGRES_USER", dotenv.get("POSTGRES_USER"));
		System.setProperty("POSTGRES_PASSWORD", dotenv.get("POSTGRES_PASSWORD"));

		SpringApplication.run(DemoApplication.class, args);
	}

}
