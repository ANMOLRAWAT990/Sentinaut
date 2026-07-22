import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import config

class EmailService:
    def __init__(self):
        self.host = config.SMTP_HOST
        self.port = int(config.SMTP_PORT) if config.SMTP_PORT else 587
        self.user = config.SMTP_USER
        self.password = config.SMTP_PASSWORD

    def send_email(self, to_email: str, subject: str, html_body: str):
        if not self.host or not self.user or not self.password:
            print('WARNING: SMTP credentials not configured. Skipping email send.')
            print(f'[MOCK EMAIL to {to_email}] Subject: {subject}\\nBody: {html_body}')
            return False

        try:
            msg = MIMEMultipart()
            msg['From'] = self.user
            msg['To'] = to_email
            msg['Subject'] = subject
            msg.attach(MIMEText(html_body, 'html'))

            server = smtplib.SMTP(self.host, self.port)
            server.starttls()
            server.login(self.user, self.password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f'Error sending email: {e}')
            return False

email_service = EmailService()
