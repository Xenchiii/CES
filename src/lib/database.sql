-- database.sql

-- Table for storing student information, linked to profile and potential future auth
CREATE TABLE IF NOT EXISTS student_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id_no VARCHAR(20) UNIQUE NOT NULL COMMENT 'Official student ID number (e.g., UA202301963)',
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20) NULL COMMENT 'Student contact phone number',
    full_name VARCHAR(255) NOT NULL,
    course VARCHAR(100) NULL,
    year_level VARCHAR(20) NULL COMMENT 'e.g., 1st Year, 2nd Year',
    section VARCHAR(50) NULL COMMENT 'e.g., LFAU233A002',
    date_of_birth DATE NULL,
    profile_image_url VARCHAR(2048) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='Stores core student profile information';

-- Table for tracking membership payments
-- This links students to their payment status for various memberships.
CREATE TABLE IF NOT EXISTS membership_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_info_id INT NOT NULL COMMENT 'Foreign key linking to student_info table',
    payment_request_id VARCHAR(100) UNIQUE NOT NULL COMMENT 'Unique ID generated for the payment attempt',
    transaction_id VARCHAR(100) NULL UNIQUE COMMENT 'Transaction ID from GCash (if successful)',
    amount_paid DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'PHP',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_for_ces BOOLEAN DEFAULT FALSE COMMENT 'Flag if CES membership was paid for in this transaction',
    paid_for_icso BOOLEAN DEFAULT FALSE COMMENT 'Flag if ICSO membership was paid for in this transaction',
    paid_for_suborg_slug VARCHAR(50) NULL COMMENT 'Slug of the sub-org paid for (e.g., ai-mentors)',
    payment_timestamp DATETIME NULL COMMENT 'Timestamp when payment was confirmed successful',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_info_id) REFERENCES student_info(id)
        ON DELETE CASCADE -- If student info is deleted, remove payment records too
) COMMENT='Tracks individual membership payment transactions';


-- Table for storing notification data
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_info_id INT NULL COMMENT 'Link to student if applicable (e.g., payment success), NULL for general notifications',
    notification_type VARCHAR(50) NOT NULL COMMENT 'e.g., payment_success, event_reminder, general_announcement',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_transaction_id VARCHAR(100) NULL COMMENT 'Link to a specific payment transaction if relevant',
    notification_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_info_id) REFERENCES student_info(id) ON DELETE SET NULL, -- Keep notification even if student deleted
    FOREIGN KEY (related_transaction_id) REFERENCES membership_payments(transaction_id) ON DELETE SET NULL -- Keep notification if payment deleted
) COMMENT='Stores notifications for users, including payment confirmations and announcements';


-- NEW Table for Finance/GCash Transactions
CREATE TABLE IF NOT EXISTS finance_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_request_id VARCHAR(100) UNIQUE NOT NULL COMMENT 'Unique ID generated for the payment request',
    transaction_id VARCHAR(100) NULL UNIQUE COMMENT 'Unique Transaction ID from GCash after successful payment',
    student_info_id INT NOT NULL COMMENT 'Foreign key linking to student_info table',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Amount paid',
    currency VARCHAR(3) NOT NULL DEFAULT 'PHP' COMMENT 'Currency code',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING' COMMENT 'Status of the GCash transaction',
    transaction_timestamp DATETIME NULL COMMENT 'Timestamp when the transaction was completed or last updated',
    membership_ces BOOLEAN DEFAULT FALSE COMMENT 'Indicates if CES membership was part of this payment',
    membership_icso BOOLEAN DEFAULT FALSE COMMENT 'Indicates if ICSO membership was part of this payment',
    membership_suborg_slug VARCHAR(50) NULL COMMENT 'Slug of the sub-organization included in this payment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_info_id) REFERENCES student_info(id)
        ON DELETE RESTRICT -- Prevent deleting student if finance records exist (optional, adjust as needed)
        ON UPDATE CASCADE -- If student ID changes (unlikely), update here
) COMMENT='Detailed log of all GCash finance transactions';


-- Optional: Add indexes for faster lookups
CREATE INDEX idx_student_payments ON membership_payments(student_info_id);
CREATE INDEX idx_notification_student ON notifications(student_info_id);
CREATE INDEX idx_finance_student ON finance_transactions(student_info_id);
CREATE INDEX idx_finance_transaction_id ON finance_transactions(transaction_id);
CREATE INDEX idx_finance_request_id ON finance_transactions(payment_request_id);

-- Note: You might want to add more specific indexes based on common query patterns.
-- For example, indexing `payment_status` or `notification_type` if you filter by them frequently.
