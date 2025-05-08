package com.icct.ces.email;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync; // Optional: for async email sending

@SpringBootApplication
@EnableAsync // Optional: Enable asynchronous methods for non-blocking email sending
public class EmailServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmailServiceApplication.class, args);
		System.out.println("\nEmail Service Started. Access endpoints at http://localhost:8082 (or configured port)");
		// Add EmailController, EmailService, etc.
	}

}
