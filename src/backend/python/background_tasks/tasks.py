from celery import Celery
import time

# Configure Celery: Replace 'redis://localhost:6379/0' with your actual broker URL
# If using RabbitMQ: 'amqp://guest:guest@localhost:5672//'
# Ensure the broker (Redis/RabbitMQ) is running.
app = Celery('tasks', broker='redis://localhost:6379/0', backend='redis://localhost:6379/0')

# Optional configuration settings
app.conf.update(
    task_serializer='json',
    accept_content=['json'],  # Allow JSON content
    result_serializer='json',
    timezone='Asia/Manila', # Set your timezone
    enable_utc=True,
)

@app.task(bind=True, max_retries=3, default_retry_delay=60) # Example retry config
def send_welcome_email(self, user_email: str, user_name: str):
    """
    Simulates sending a welcome email to a new user.
    """
    print(f"Task received: Sending welcome email to {user_email} ({user_name})...")
    try:
        # --- Placeholder for actual email sending logic ---
        # Use libraries like smtplib, requests (for email APIs like SendGrid/Mailgun),
        # or integrate with a Java/Spring Mail service via API call.
        # Example:
        # import smtplib
        # from email.message import EmailMessage
        # msg = EmailMessage()
        # msg.set_content(f"Welcome to ICCT CES, {user_name}!")
        # msg['Subject'] = 'Welcome to the Computer Explorer Society!'
        # msg['From'] = 'noreply@icct-ces.com'
        # msg['To'] = user_email
        # s = smtplib.SMTP('localhost', 1025) # Or your actual SMTP server
        # s.send_message(msg)
        # s.quit()

        time.sleep(5) # Simulate network delay/email sending time

        # Simulate potential failure for retry demonstration
        # if random.random() < 0.3: # 30% chance of failure
        #     raise ConnectionError("Simulated SMTP connection error")

        print(f"Email successfully sent to {user_email}")
        return {"status": "success", "email": user_email}
    except Exception as exc:
        print(f"Email sending failed for {user_email}: {exc}. Retrying...")
        # Celery's `bind=True` allows access to `self` for retrying
        raise self.retry(exc=exc)

@app.task(bind=True, max_retries=2, default_retry_delay=300) # Longer retry for reports
def generate_large_report(self, report_type: str, user_id_requested_by: int, params: dict):
    """
    Simulates generating a large, time-consuming report.
    """
    print(f"Task received: Generating report type '{report_type}' requested by user {user_id_requested_by} with params: {params}...")
    try:
        # --- Placeholder for report generation logic ---
        # This could involve heavy database queries, data processing with Pandas, etc.
        # report_data = run_complex_analysis(params)
        # save_report_to_storage(report_data, report_id) # e.g., S3, local file system
        # notify_user_of_completion(user_id_requested_by, report_id)

        time.sleep(30) # Simulate long generation time

        report_id = f"REPORT_{report_type.upper()}_{int(time.time())}"
        print(f"Report generation complete. Report ID: {report_id}")
        # The result here could be the report ID or a URL to the report
        return {"status": "success", "report_id": report_id}
    except Exception as exc:
        print(f"Report generation failed: {exc}. Retrying...")
        raise self.retry(exc=exc)

@app.task
def send_event_reminder_email(event_id: int, user_email: str, event_title: str):
    """
    Simulates sending an event reminder email.
    """
    print(f"Task received: Sending reminder for event '{event_title}' (ID: {event_id}) to {user_email}...")
    # --- Placeholder for email sending logic ---
    time.sleep(2)
    print(f"Reminder email sent to {user_email} for event {event_id}")
    return {"status": "success", "email": user_email, "event_id": event_id}

# You can add more tasks here, e.g., for membership renewal reminders, etc.
```