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
    dark_mode: Optional[bool] = None
    is_active: Optional[bool] = None

class PropertyUpdate(BaseModel):
    custom_tags: Optional[List[str]] = None
    is_active: Optional[bool] = None

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

class Notification(BaseModel):
    id: Optional[str] = None
    property: str
    message: str
    type: str = "Info"
    is_read: bool = False
    created_at: Optional[str] = None
