-- Define the table for finance/GCash payments
CREATE TABLE FinancePayments (
    paymentId VARCHAR(255) PRIMARY KEY, -- Unique ID for the payment (can be transaction ID from GCash or internal)
    paymentRequestId VARCHAR(255) NOT NULL, -- ID generated when initiating the payment
    studentId VARCHAR(50) NOT NULL, -- Foreign key linking to the student (assuming a Student table exists)
    amount DECIMAL(10, 2) NOT NULL, -- Amount paid
    currency VARCHAR(10) DEFAULT 'PHP', -- Currency (defaulting to PHP)
    paymentMethod VARCHAR(50) DEFAULT 'GCash', -- Payment method used
    paymentStatus VARCHAR(20) NOT NULL, -- Status like 'SUCCESS', 'PENDING', 'FAILED'
    paymentTimestamp DATETIME NOT NULL, -- Timestamp when the payment was completed/attempted
    metadata JSON, -- Store additional metadata like email, section, memberships paid for
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation time
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Record update time
    -- Optional: Add FOREIGN KEY constraint if a Students table exists
    -- FOREIGN KEY (studentId) REFERENCES Students(studentId) -- Example FK constraint
);

-- Optional: Add indexes for frequently queried columns
CREATE INDEX idx_finance_studentId ON FinancePayments(studentId);
CREATE INDEX idx_finance_status ON FinancePayments(paymentStatus);
CREATE INDEX idx_finance_timestamp ON FinancePayments(paymentTimestamp);

-- Note: The FOREIGN KEY constraint assumes a 'Students' table exists with a 'studentId' primary key.
-- Adjust or remove this constraint based on your actual database schema.
