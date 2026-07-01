from pydantic import BaseModel
from typing import List, Optional

class Review(BaseModel):
    id: Optional[str] = None
    guestName: str
    platform: str
    text: str
    sentiment: str = "Neutral"
    tags: List[str] = []
    status: str = "Pending"
    property: Optional[str] = None

class Action(BaseModel):
    id: Optional[str] = None
    task: str
    status: str
    property: Optional[str] = None

class Property(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    status: str = "Active"
    owner_email: Optional[str] = None

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    property: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    property: Optional[str] = None
    initials: Optional[str] = None
