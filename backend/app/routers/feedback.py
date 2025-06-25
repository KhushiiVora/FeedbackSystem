from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from datetime import datetime
from app.models import Feedback, FeedbackCreate, FeedbackUpdate, UserRole
from app.utils.auth import get_current_user
from app.utils.helpers import convert_objectid_to_str
from app.database import db

router = APIRouter(prefix="/api/feedback", tags=["Feedback"])

@router.post("/", response_model=Feedback)
async def create_feedback(feedback_data: FeedbackCreate, current_user = Depends(get_current_user)):
    """Create new feedback (manager only)"""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Only managers can create feedback")
    
    # Verify employee exists
    employee = await db.users.find_one({"_id": ObjectId(feedback_data.employee_id)})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    feedback_doc = feedback_data.dict()
    feedback_doc["manager_id"] = ObjectId(current_user.id)
    feedback_doc["employee_id"] = ObjectId(feedback_data.employee_id)
    feedback_doc["created_at"] = datetime.utcnow()
    feedback_doc["updated_at"] = datetime.utcnow()
    
    result = await db.feedback.insert_one(feedback_doc)
    created_feedback = await db.feedback.find_one({"_id": result.inserted_id})
    
    return Feedback(**convert_objectid_to_str(created_feedback))

@router.get("/", response_model=List[Feedback])
async def get_feedback_list(current_user = Depends(get_current_user)):
    """Get feedback list for the current user"""
    if current_user.role == UserRole.MANAGER:
        # Managers see feedback they've given
        feedback_cursor = db.feedback.find({"manager_id": ObjectId(current_user.id)})
    else:
        # Employees see feedback they've received
        feedback_cursor = db.feedback.find({"employee_id": ObjectId(current_user.id)})
    
    feedback_list = await feedback_cursor.to_list(None)
    return [Feedback(**convert_objectid_to_str(f)) for f in feedback_list]

@router.get("/{feedback_id}", response_model=Feedback)
async def get_feedback_by_id(feedback_id: str, current_user = Depends(get_current_user)):
    """Get specific feedback"""
    feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id)})
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    # Check permissions
    if current_user.role == UserRole.MANAGER:
        if str(feedback["manager_id"]) != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    else:
        if str(feedback["employee_id"]) != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    feedback = convert_objectid_to_str(feedback)
    return Feedback(**feedback)

@router.put("/{feedback_id}", response_model=Feedback)
async def update_feedback(feedback_id: str, feedback_data: FeedbackUpdate, current_user = Depends(get_current_user)):
    """Update feedback (manager only)"""
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Only managers can update feedback")
    
    feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "manager_id": ObjectId(current_user.id)})
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found or you don't have permission to edit it")
    
    update_data = feedback_data.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": update_data})
    
    updated_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id)})
    return Feedback(**convert_objectid_to_str(updated_feedback))

@router.put("/{feedback_id}/acknowledge", response_model=Feedback)
async def acknowledge_feedback(feedback_id: str, current_user = Depends(get_current_user)):
    """Acknowledge feedback (employee only)"""
    if current_user.role != UserRole.EMPLOYEE:
        raise HTTPException(status_code=403, detail="Only employees can acknowledge feedback")
    
    feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id), "employee_id": ObjectId(current_user.id)})
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found or you are not the recipient")
    
    await db.feedback.update_one({"_id": ObjectId(feedback_id)}, {"$set": {"acknowledged": True, "updated_at": datetime.utcnow()}})
    
    updated_feedback = await db.feedback.find_one({"_id": ObjectId(feedback_id)})
    return Feedback(**convert_objectid_to_str(updated_feedback))