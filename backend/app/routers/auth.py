from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from datetime import datetime
from app.models import UserCreate, UserLogin, Token, User, UserRole
from app.utils.auth import hash_password, verify_password, create_access_token
from app.utils.helpers import convert_objectid_to_str
from app.database import db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate manager_id for employees
    if user_data.role == UserRole.EMPLOYEE and user_data.manager_id:
        manager = await db.users.find_one({"_id": ObjectId(user_data.manager_id)})
        if not manager or manager["role"] != UserRole.MANAGER:
            raise HTTPException(status_code=400, detail="Invalid manager ID")
    
    # Create user
    hashed_password = hash_password(user_data.password)
    user_doc = {
        "email": user_data.email,
        "password": hashed_password,
        "name": user_data.name,
        "role": user_data.role,
        "manager_id": ObjectId(user_data.manager_id) if user_data.manager_id else None,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = str(result.inserted_id)
    
    # Create token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    user_doc = convert_objectid_to_str(user_doc)
    user = User(**user_doc)
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """Login user"""
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user["_id"])})
    user = convert_objectid_to_str(user)
    user_obj = User(**user)
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)
