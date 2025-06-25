from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from app.models import User, UserRole
from app.utils.auth import get_current_user
from app.utils.helpers import convert_objectid_to_str
from app.database import db

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Get current user's details"""
    return current_user

@router.get("/team", response_model=List[User])
async def get_team(current_user: User = Depends(get_current_user)):
    """Get the list of employees for the current manager"""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Only managers can view a team")

    team_cursor = db.users.find({"manager_id": ObjectId(current_user.id)})
    team_list = await team_cursor.to_list(None)
    
    return [User(**convert_objectid_to_str(user)) for user in team_list]