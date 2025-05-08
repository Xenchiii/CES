-- Database schema for ICCT CES Membership Application

-- Table to store basic student information
CREATE TABLE students (
    student_id VARCHAR(15) PRIMARY KEY COMMENT 'Unique student identifier (e.g., UA202301963)',
    email VARCHAR(255) UNIQUE NOT NULL COMMENT 'Student email address',
    phone_number VARCHAR(15) COMMENT 'Student phone number (PH format)',
    section VARCHAR(20) COMMENT 'Student section (e.g., LFAU322A002)',
    full_name VARCHAR(255) COMMENT 'Student full name (optional, can be added later)',
    date_of_birth DATE COMMENT 'Student date of birth (optional)',
    course VARCHAR(100) COMMENT 'Student course (optional)',
    year_level VARCHAR(10) COMMENT 'Student year level (optional)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Stores basic information about students registering for memberships';

-- Table to store information about sub-organizations
CREATE TABLE sub_organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique identifier slug (e.g., ai-mentors)',
    name VARCHAR(100) NOT NULL COMMENT 'Display name of the sub-organization',
    description TEXT COMMENT 'Brief description of the sub-organization',
    cost DECIMAL(10, 2) NOT NULL DEFAULT 15.00 COMMENT 'Membership cost for this sub-organization'
) COMMENT 'Details about specific sub-organizations students can join';

-- Populate sub-organizations (example data)
-- Costs can be adjusted here or managed dynamically if they change often
INSERT INTO sub_organizations (slug, name, description, cost) VALUES
('ai-mentors', 'AI Mentors', 'Exploring the world of Artificial Intelligence and Machine Learning.', 15.00),
('algorithm-knights', 'Algorithm Knights', 'Mastering algorithms and competitive programming.', 15.00),
('code-warriors', 'Code Warriors', 'Honing software development and coding practices.', 15.00),
('cybernet-rangers', 'Cybernet Rangers', 'Focusing on cybersecurity, ethical hacking, and network defense.', 15.00),
('digital-expressionists', 'Digital Expressionists', 'Creativity in digital art, multimedia, and UI/UX design.', 15.00),
('ghz-builders', 'GHZ Builders', 'Hands-on hardware assembly, troubleshooting, and PC building.', 15.00),
('mobile-mnemonics', 'Mobile Mnemonics', 'Developing applications for Android and iOS platforms.', 15.00),
('web-arachnids', 'Web Arachnids', 'Building modern websites and web applications.', 15.00);

-- Table to store payment transaction details
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(15) NOT NULL COMMENT 'FK referencing the student who made the payment',
    gcash_payment_request_id VARCHAR(100) UNIQUE COMMENT 'Unique ID generated for the GCash request',
    gcash_transaction_id VARCHAR(100) UNIQUE COMMENT 'Actual transaction ID from GCash (if successful)',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Total amount paid',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING' COMMENT 'Status of the payment',
    description VARCHAR(255) COMMENT 'Description of the payment (e.g., ICCT CES Membership)',
    payment_method VARCHAR(20) DEFAULT 'GCASH' COMMENT 'Payment method used',
    payment_at TIMESTAMP NULL COMMENT 'Timestamp when the payment was successfully completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) COMMENT 'Records payment transactions made by students';

-- Table to link payments to the specific memberships purchased
-- This allows a single payment to cover multiple memberships
CREATE TABLE payment_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT NOT NULL COMMENT 'FK referencing the payment transaction',
    membership_type ENUM('CES', 'ICSO', 'SUB_ORG') NOT NULL COMMENT 'Type of membership purchased',
    sub_organization_id INT NULL COMMENT 'FK referencing sub_organizations table (only if membership_type is SUB_ORG)',
    cost_at_purchase DECIMAL(10, 2) NOT NULL COMMENT 'Cost of this specific membership at the time of purchase',
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE CASCADE,
    FOREIGN KEY (sub_organization_id) REFERENCES sub_organizations(id) ON DELETE SET NULL -- Or CASCADE if sub-org deletion should remove this record
) COMMENT 'Junction table linking payments to specific memberships purchased';

-- Table to store notifications, potentially linked to successful payments
CREATE TABLE notifications (
    notification_id VARCHAR(50) PRIMARY KEY COMMENT 'Unique notification identifier (can be transaction ID or generated)',
    student_id VARCHAR(15) NOT NULL COMMENT 'FK referencing the student this notification is for',
    payment_id INT NULL COMMENT 'FK referencing the payment this notification relates to (optional)',
    type VARCHAR(50) NOT NULL COMMENT 'Type of notification (e.g., payment_success, event_reminder)',
    title VARCHAR(255) NOT NULL COMMENT 'Title of the notification',
    message TEXT COMMENT 'Detailed message of the notification',
    is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether the notification has been read by the user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id) ON DELETE SET NULL -- Allow notification to exist even if payment is deleted
) COMMENT 'Stores notifications for users, including payment receipts';

-- Optional: Add indexes for frequently queried columns
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_notifications_student_read ON notifications(student_id, is_read);
CREATE INDEX idx_payment_memberships_type ON payment_memberships(membership_type);

-- Example Constants (Not part of schema, but for reference)
-- CES Cost: 20.00
-- ICSO Cost: 20.00
