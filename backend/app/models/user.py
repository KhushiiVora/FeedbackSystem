from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    MANAGER = "manager"
    EMPLOYEE = "employee"

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: UserRole
    manager_id: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    role: UserRole
    manager_id: Optional[str] = None
    created_at: datetime

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User