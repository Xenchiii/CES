# ICCT COLLEGES COMPUTER EXPLORER SOCIETY - ANTIPOLO CAMPUS

This is the official website for the ICCT Colleges Computer Explorer Society - Antipolo Campus, built with Next.js and Firebase.

## Core Features:

### Basic Functionality
-   **Navigation Bar with Logo**: Sidebar navigation with links to Home, Events, Achievements, Sub-orgs, Membership, About, and Contact pages. Logo displayed on top.
-   **Event Calendar**: Displays a calendar of upcoming events for the organization.
-   **News Feed**: Shows announcements, news, and updates related to CES Antipolo.
-   **Contact Form**: Allows users to send inquiries and messages to the organization.
-   **About Page**: Provides information about the organization's mission, history, officers, and development team.
-   **Achievements Page**: Showcases accomplishments of members and sub-organizations.
-   **Courses Page**: Lists available courses/subjects with links to individual subject detail pages.
    *   **Individual Subject Pages**: Dedicated pages for subjects like Social and Professional Issues, Information Management, Quantitative Methods, Cisco Networking. Each page includes tabs for Announcements, Module, Calendar, Gradebook/Activities, Groups, and Discussion.

### Membership
-   **Membership Catalog**: Displays available memberships (CES: ₱20, ICSO: ₱20, Sub-org: ₱15) with descriptions. Lists sub-organizations: AI Mentors, Algorithm Knights, Code Warriors, Cybernet Rangers, Digital Expressionists, GHZ Builders, Mobile Mnemonics, Web Arachnids.
-   **Membership Application**: Allows students to apply for memberships by providing email, phone number, section, student ID, and selecting desired memberships.
-   **Sub-Organization Pages**: Dedicated pages for each sub-organization detailing their focus, activities, and leaders.
-   **Gcash Payment Processing**: Integrates with GCash for membership payments. Redirects users to a simulated GCash payment page and back to a confirmation page.
-   **Digital Receipt**: Generates and displays a digital receipt on the payment confirmation page, which can be downloaded as a text file.

### AI Integration
-   **Sparrow AI Companion**: An AI assistant (using Genkit and Gemini) integrated via a chat interface (sheet) to guide users, answer questions about the website content, events, personnel, and provide contextual help.
    *   **Contextual Help**: (Implemented via Genkit Flow Enhancement) Sparrow's responses are tailored based on the user's current page and profile information.
    *   **Personalized Recommendations**: (Implemented via Genkit Flow Enhancement) Sparrow can suggest relevant events, sub-organizations, or resources based on user profile/activity.
    *   **AI-Powered Tutoring**: (Implemented via Python API Placeholders & Genkit Flow) Sparrow can provide explanations for basic CS concepts related to sub-orgs.
    *   **Automated Task Assistance**: (Implemented via Python API Placeholders & Genkit Flow) Sparrow can help users find information on the website.
-   **AI-Powered Content Generation**: (Implemented via Genkit Flow) Assist admins with writing website content (e.g., news, descriptions).

### User Profile & Notifications
-   **User Profile**: Allows users to view and edit their profile information (Name, Year, Course, Section, DOB, Student ID, Email) via a dedicated profile sheet accessible from the sidebar.
-   **Notification System**: Displays notifications (e.g., successful payment confirmation, upcoming events) in the sidebar. Payment confirmations are stored in local storage.
    *   **Notification Preferences**: (Planned Backend: Java/Python API) Allow users to customize the types of notifications they receive.

### Community & Engagement
-   **Forums/Discussion Boards**: (Implemented - Basic UI/Mock Data & Backend Placeholders) Create a space for members to discuss topics, ask questions, and collaborate.
    *   **Forum Categories**: Homework Help, Class Discussions, Study Groups, Announcements, Extracurricular Activities, College & Career Guidance, Resources & Study Materials, Technical Support, Feedback & Suggestions, Rules & Guidelines, Moderation & Support.
    *   **Post and Reply System**: (Implemented via Java API Placeholders) Create posts with text, images, or files; reply to foster discussion.
    *   **Search and Filter**: (Implemented via Java API Placeholders) Search by keywords, subjects, tags; filter by category, activity, popularity.
    *   **Rich Text Editor**: (Implemented via Java API Placeholders) Format text (bold, italic, lists); support code snippets and LaTeX.
    *   **Notifications and Subscriptions**: (Implemented via Java API Placeholders) Get alerts for replies or new posts in subscribed threads.
    *   **Voting and Ranking**: (Implemented via Java API Placeholders) Upvote useful posts; mark best answers.
    *   **Moderation Tools**: (Implemented via Java API Placeholders) Report content; admin controls for editing/deleting.
    *   **Resource Sharing**: (Implemented via Java API Placeholders) Sections for sharing study materials, links, etc.
-   **Project Showcase**: (Implemented - Basic UI/Mock Data) A dedicated section for members to display projects and portfolios.
-   **Achievement Leaderboard**: (Implemented - Basic UI/Mock Data) Publicly recognize members who have achieved significant accomplishments.

### Administrative & Content
-   **Admin Dashboard**: (Implemented - Basic UI/Mock Data & Backend Placeholders) A protected area to manage content (news, events, achievements), user roles (Admin, Officer, Member), membership applications (review, payment verification), basic sub-organization details, finance overview, and view basic analytics. Only teachers and officers can access.
    *   **Content Management System (CMS)**: (Implemented Backend: Java/Python API Placeholders) A more robust system for managing website content.
    *   **Event Registration System**: (Implemented Backend: Java/Python API Placeholders) A system for managing event sign-ups.
    *   **Automated Reporting**: (Implemented Backend: Python API Placeholders) Generate detailed reports on website usage, member engagement, etc.
    *   **Sub-Organization Management Tools**: (Implemented Backend: Java/Python API Placeholders) Allow sub-org leaders to manage their sections.
    *   **Application Review System**: (Implemented Backend: Java/Python API Placeholders) Streamline the membership application process.
    *   **Role-Based Access Control (RBAC)**: (Implemented Backend: Java/Python API Placeholders) Implement granular control over website features.
    *   **Analytics Dashboard (Comprehensive)**: (Implemented Backend: Python API Placeholders) A comprehensive view of website traffic and metrics.
    *   **Automated Email System**: (Implemented Backend: Java/Python API Placeholders) A system to send automated emails.
-   **Professor Dashboard**: (Implemented - Basic UI/Mock Data) A protected area for professors to manage their courses.
    *   **Course Management**: Select a course to manage announcements and activities.
    *   **Announcements Management**: Create, edit, or delete announcements for a selected course.
    *   **Activities Management**: Manage assignments, quizzes, and other activities for a selected course.

### Planned Features (Future Development - High Level)
-   **User Experience:**
    *   Personalized Dashboard: Central hub for users.
    *   Interactive Tutorials/Learning Paths.
-   **Community:**
    *   Blog: Platform for insights and updates.
    *   Member Directory (Enhanced): Advanced search, filtering, privacy. (Planned Backend: Java/Python API)
    *   Project Showcase (Enhanced): Uploads, feedback, categorization. (Planned Backend: Java/Python API)
    *   Skill-Sharing Platform (Enhanced): Reputation system, search. (Planned Backend: Java/Python API)
    *   Interest Groups (Enhanced): Group management, discussions. (Planned Backend: Java/Python API)
    *   Achievements Leaderboard (Enhanced): Dynamic updates, categories. (Planned Backend: Java/Python API)
    *   Pair Programming/Study Group Finder (Enhanced): Matching algorithms. (Planned Backend: Java/Python API)
-   **Technical:**
    *   Real Payment Gateway Integration (GCash).
    *   Database Implementation (MySQL).
    *   User Authentication (Login/Register/Password Reset). (Planned Backend: Java/Python API)
    *   **High-Performance Computing**: (Implemented Backend: C++ API Placeholders) For specialized simulations or calculations needed by projects/sub-orgs.
    *   **Hardware Interaction**: (Implemented Backend: C++/Python API Placeholders) API endpoints for interacting with hardware relevant to sub-org projects (e.g., GHZ Builders).
    *   **Background Task Processing**: (Implemented Backend: Python Placeholders) For large data analysis, report generation, complex recommendations.

## Style Guidelines:

-   **Primary Color**: Dark Blue (#003049)
-   **Secondary Color**: Bumblebee (#FCE205)
-   **Accent Color**: Steel Blue (#4682B4)
-   **Layout**: Clean, modern, responsive grid layout. Uses ShadCN components and Tailwind CSS.
-   **Animations**: Subtle hover effects, transitions, scroll-triggered animations (fadeIn, slideIn, scaleUp), and potentially more complex animations using libraries if needed.
-   **Icons**: Uses `lucide-react` for iconography.
-   **Theming**: Supports Light/Dark mode and multiple color themes selectable via the sidebar.
-   **Accessibility Tools**: Features to improve accessibility (adjustable font size).

## Tech Stack:

-   **Frontend Framework**: Next.js (App Router)
-   **Language (Frontend)**: TypeScript, JavaScript
-   **Styling**: Tailwind CSS, ShadCN UI, CSS
-   **State Management**: React Context API (for Sidebar, Theme)
-   **AI**: Genkit (with Google Gemini)
-   **Database**: MySQL
-   **Backend Services (Planned & Partial Placeholders):**
    *   **Java (Spring Boot)**: Potential for Forum API, User Authentication, Core CMS, Event Registration, Automated Email System. *(Placeholders exist)*
    *   **Python (Flask/Django/Celery)**: Potential for Data Analysis, AI Tutoring API, Automated Reporting, Email System, Hardware Interaction API, Background Task Processing. *(Placeholders exist)*
    *   **C++**: Potential for High-Performance Computing API, Hardware Interaction API. *(Placeholders exist)*
-   **Deployment**: Vercel / Firebase Hosting (TBD)


To get started, explore the `src/app` directory, particularly `src/app/page.tsx`.
# CES
