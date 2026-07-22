import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    @property
    def MONGODB_URI(self):
        return os.getenv("MONGODB_URI", "mongodb://localhost:27017")
        
    @property
    def GEMINI_API_KEY(self):
        return os.getenv("GEMINI_API_KEY")

    @property
    def GEMINI_CHAT_API_KEY(self):
        return os.getenv("GEMINI_CHAT_API_KEY")

    @property
    def TWILIO_ACCOUNT_SID(self):
        return os.getenv("TWILIO_ACCOUNT_SID")

    @property
    def TWILIO_AUTH_TOKEN(self):
        return os.getenv("TWILIO_AUTH_TOKEN")

    @property
    def TWILIO_WHATSAPP_NUMBER(self):
        return os.getenv("TWILIO_WHATSAPP_NUMBER")

    @property
    def SMTP_HOST(self):
        return os.getenv("SMTP_HOST")

    @property
    def SMTP_PORT(self):
        return os.getenv("SMTP_PORT")

    @property
    def SMTP_USER(self):
        return os.getenv("SMTP_USER")

    @property
    def SMTP_PASSWORD(self):
        return os.getenv("SMTP_PASSWORD")

    @property
    def GOOGLE_TRANSLATE_API_KEY(self):
        return os.getenv("GOOGLE_TRANSLATE_API_KEY")

    @property
    def OUTSCRAPER_API_KEY(self):
        return os.getenv("OUTSCRAPER_API_KEY")

    @property
    def FRONTEND_URL(self):
        return os.getenv("FRONTEND_URL", "http://localhost:5173")

    @property
    def RAZORPAY_KEY_ID(self):
        return os.getenv("RAZORPAY_KEY_ID", "")

    @property
    def RAZORPAY_KEY_SECRET(self):
        return os.getenv("RAZORPAY_KEY_SECRET", "")

config = Config()
