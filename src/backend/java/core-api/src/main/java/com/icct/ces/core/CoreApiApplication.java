package com.icct.ces.core;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CoreApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoreApiApplication.class, args);
		System.out.println("\nCore API Service Started. Access endpoints at http://localhost:8081 (or configured port)");
		// Add controllers, services, repositories, entities for CMS, Event Reg, RBAC etc.
	}

}
