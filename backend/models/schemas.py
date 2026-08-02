from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class Review(BaseModel):
    id: Optional[str] = None
    guestName: str
    platform: str
    text: str
    sentiment: str = "Neutral"
    tags: List[str] = []
    status: str = "Pending"
    property: Optional[str] = None
    replied: bool = False
    translated_text: Optional[str] = None
    created_at: Optional[str] = None
    is_competitor: bool = False
    competitor_name: Optional[str] = None

class Action(BaseModel):
    id: Optional[str] = None
    task: str
    status: str
    property: Optional[str] = None
    assigned_to: Optional[str] = None
    priority: str = "Medium"
    created_at: Optional[str] = None
    completed_at: Optional[str] = None
    notes: List[str] = []
    is_archived: bool = False

class Property(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    status: str = "Active"
    owner_email: Optional[str] = None
    is_active: bool = True
    custom_tags: List[str] = []
    plan: str = "trial"
    ai_usage_month: int = 0
    usage_reset_month: str = ""

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str
    property: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    property: Optional[str] = None
    initials: Optional[str] = None
    is_active: bool = True
    dark_mode: bool = False

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)
    dark_mode: Optional[bool] = None
    is_active: Optional[bool] = None

class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    custom_tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    plan: Optional[str] = None

class Invite(BaseModel):
    id: Optional[str] = None
    email: str
    role: str
    property: str
    token: str
    expires_at: str

class Checkout(BaseModel):
    id: Optional[str] = None
    guestName: str
    phone: str
    property: str
    timestamp: Optional[str] = None

class PaymentVerifyRequest(BaseModel):
    property: str
    plan: str
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

class Notification(BaseModel):
    id: Optional[str] = None
    property: str
    message: str
    type: str = "Info"
    is_read: bool = False
    created_at: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    role: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=6)

class NewsletterRequest(BaseModel):
    email: EmailStr

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    message: str
