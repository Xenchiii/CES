-- MySQL Database Schema for ICCT CES Website

-- User Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Store hashed password
    Name VARCHAR(255),
    Year VARCHAR(50), -- Adjusted size
    Course VARCHAR(255),
    Section VARCHAR(50), -- Adjusted size
    DOB DATE,
    StudentID VARCHAR(20) UNIQUE, -- Adjusted size, made unique
    Role ENUM('Admin', 'Officer', 'Member') DEFAULT 'Member',
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    LastLogin DATETIME,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Forum Categories Table
CREATE TABLE ForumCategories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    Slug VARCHAR(100) NOT NULL UNIQUE, -- Adjusted size
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Icon VARCHAR(50) -- Lucide icon name
);

-- Forum Threads Table
CREATE TABLE ForumThreads (
    ThreadID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryID INT,
    Title VARCHAR(255) NOT NULL,
    AuthorID INT,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    LastReplyAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    ReplyCount INT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    IsSticky BOOLEAN DEFAULT FALSE,
    IsLocked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (CategoryID) REFERENCES ForumCategories(CategoryID) ON DELETE SET NULL, -- Allow category deletion
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID) ON DELETE SET NULL -- Keep thread if author deleted
);

-- Forum Posts Table
CREATE TABLE ForumPosts (
    PostID INT PRIMARY KEY AUTO_INCREMENT,
    ThreadID INT,
    AuthorID INT,
    Content TEXT, -- Store HTML content
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    Upvotes INT DEFAULT 0,
    IsBestAnswer BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (ThreadID) REFERENCES ForumThreads(ThreadID) ON DELETE CASCADE, -- Delete posts if thread deleted
    FOREIGN KEY (AuthorID) REFERENCES Users(UserID) ON DELETE SET NULL -- Keep post if author deleted
);

-- Events Table
CREATE TABLE Events (
    EventID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Date DATE,
    EndDate DATE,
    Location VARCHAR(255),
    Description TEXT,
    RequiresRegistration BOOLEAN DEFAULT FALSE,
    RegistrationFee DECIMAL(10, 2) DEFAULT 0.00,
    RegistrationCount INT DEFAULT 0 -- Track number of registrants
);

-- Achievements Table
CREATE TABLE Achievements (
    AchievementID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Date DATE,
    Org VARCHAR(255), -- Can be a sub-org or individual name
    Description TEXT,
    Participants TEXT, -- Store participants as comma-separated string or JSON array
    Image VARCHAR(255),
    DataAiHint VARCHAR(255)
);

-- SubOrganizations Table
CREATE TABLE SubOrganizations (
    SubOrgID INT PRIMARY KEY AUTO_INCREMENT,
    Slug VARCHAR(100) NOT NULL UNIQUE, -- Adjusted size
    Name VARCHAR(255) NOT NULL,
    Leader VARCHAR(255), -- Consider linking to UserID if leaders are users
    Description TEXT
);

-- Payments Table (Track individual payment attempts/transactions)
CREATE TABLE Payments (
    PaymentID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    PaymentRequestID VARCHAR(255) UNIQUE, -- Your system's ID for the request
    GcashTransactionID VARCHAR(255) UNIQUE NULL, -- GCash's ID, can be NULL initially
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Pending', 'Paid', 'Failed', 'Processing') DEFAULT 'Pending',
    -- Store metadata used during payment initiation as JSON for easier retrieval
    Metadata JSON,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE SET NULL -- Keep payment record if user deleted
);

-- UserMemberships Table (Track active memberships linked to payments)
CREATE TABLE UserMemberships (
    UserMembershipID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT NOT NULL,
    MembershipType ENUM('CES', 'ICSO', 'SubOrg') NOT NULL,
    SubOrgID INT NULL, -- Link to SubOrganizations if MembershipType is 'SubOrg'
    PaymentID INT NOT NULL, -- Link to the successful payment
    StartDate DATE NOT NULL,
    EndDate DATE, -- Represents academic year or membership period
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE, -- Remove membership if user deleted
    FOREIGN KEY (SubOrgID) REFERENCES SubOrganizations(SubOrgID) ON DELETE SET NULL,
    FOREIGN KEY (PaymentID) REFERENCES Payments(PaymentID) ON DELETE RESTRICT, -- Prevent deleting payment if linked
    UNIQUE KEY unique_membership (UserID, MembershipType, SubOrgID, EndDate) -- Prevent duplicate active memberships for same period
);


-- Notifications Table
CREATE TABLE Notifications (
    NotificationID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT, -- Can be NULL for system-wide notifications
    Type VARCHAR(50), -- e.g., 'payment_success', 'event_reminder', 'new_post', 'admin_announcement'
    Title VARCHAR(255),
    Message TEXT,
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsNew BOOLEAN DEFAULT TRUE,
    RelatedEntityID INT NULL, -- Optional: ID of related item (e.g., EventID, ThreadID)
    RelatedEntityType VARCHAR(50) NULL, -- Optional: Type of related item (e.g., 'Event', 'Thread')
    Details JSON, -- Store additional context as JSON
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE -- Delete notifications if user deleted
);

-- Indexes for performance
CREATE INDEX idx_thread_category ON ForumThreads(CategoryID);
CREATE INDEX idx_post_thread ON ForumPosts(ThreadID);
CREATE INDEX idx_post_author ON ForumPosts(AuthorID);
CREATE INDEX idx_payment_user ON Payments(UserID);
CREATE INDEX idx_membership_user ON UserMemberships(UserID);
CREATE INDEX idx_notification_user ON Notifications(UserID);
