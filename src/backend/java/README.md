# Java Backend Services (Spring Boot)

This directory contains placeholder structure for Java-based backend services, likely using the Spring Boot framework, planned for the ICCT CES website. These services would run separately and communicate via APIs (RESTful).

## Services

1.  **Forum API (`forum-api/`)**
    *   Purpose: Manage forum categories, threads, posts, replies, voting, and potentially user authentication/authorization related to the forums.
    *   Technology: Java, Spring Boot, Spring Data JPA (for database interaction), Spring Security (for auth), MySQL database.
    *   Implementation: Define REST controllers (`@RestController`) with endpoints for:
        *   `GET /api/forums/categories`
        *   `GET /api/forums/categories/{slug}/threads`
        *   `POST /api/forums/categories/{slug}/threads` (Create new thread)
        *   `GET /api/forums/threads/{threadId}/posts`
        *   `POST /api/forums/threads/{threadId}/posts` (Create reply)
        *   `PUT /api/posts/{postId}/upvote`
        *   `DELETE /api/posts/{postId}` (Moderation)
        *   User authentication endpoints (`/api/auth/login`, `/api/auth/register`).

2.  **Core CMS & Event Registration (`core-api/`)** (Potential - could also be Python/Node)
    *   Purpose: Handle core content management (beyond basic news/events if needed), manage detailed event registrations, potentially handle user profiles and authentication if not done elsewhere.
    *   Technology: Java, Spring Boot, Spring Data JPA, MySQL.
    *   Implementation: Define REST endpoints for managing various content types, user profiles, event details, and registration data.

3.  **Automated Email System (`email-service/`)** (Potential - could also be Python)
    *   Purpose: Send transactional emails (welcome, password reset, notifications).
    *   Technology: Java, Spring Boot, Spring Mail.
    *   Implementation: An API endpoint that other services can call to trigger email sending, or integrated directly into other services like the Forum API or Core API.

## Running These Services

Each Spring Boot application needs to be built and run independently.
1.  Requires Java Development Kit (JDK) and Maven or Gradle.
2.  Database setup (MySQL) is required. Configure connection details in `application.properties` or `application.yml`.
3.  Build the application (e.g., `mvn clean package` or `gradle build`).
4.  Run the application (e.g., `java -jar target/your-app-name.jar`).
5.  Ensure the Next.js frontend can reach the API endpoints (CORS configuration in Spring Security).

**Note:** The structure provided is a basic placeholder. Real implementation requires defining entities, repositories, services, controllers, security configurations, etc. within each Spring Boot project.