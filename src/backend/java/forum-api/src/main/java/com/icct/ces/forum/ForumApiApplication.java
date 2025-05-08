package com.icct.ces.forum;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ForumApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForumApiApplication.class, args);
        System.out.println("\nForum API Service Started. Access endpoints at http://localhost:8080 (or configured port)");
        // Add controllers, services, repositories, entities, security config etc.
    }

}
