from fastapi import APIRouter, Depends, Query
from bson import ObjectId
from app.models import DashboardStats, Feedback, UserRole
from app.utils.auth import get_current_user
from app.utils.helpers import convert_objectid_to_str
from app.database import db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/", response_model=DashboardStats)
async def get_dashboard(
    current_user = Depends(get_current_user),
    offset: int = Query(0, ge=0),
    limit: int = Query(5, ge=1, le=50)
):
    """Get dashboard statistics"""
    if current_user.role == UserRole.MANAGER:
        # Manager dashboard: team overview
        feedback_list = await db.feedback.find({
            "manager_id": ObjectId(current_user.id)
        }).to_list(None)
        
        sentiment_breakdown = {"positive": 0, "neutral": 0, "negative": 0}
        for feedback in feedback_list:
            sentiment_breakdown[feedback["sentiment"]] += 1
        
        recent_feedback = await db.feedback.find({
            "manager_id": ObjectId(current_user.id)
        }).sort("created_at", -1).skip(offset).limit(limit).to_list(None)
        
        recent_feedback = [Feedback(**convert_objectid_to_str(f)) for f in recent_feedback]
        
    else:
        # Employee dashboard: personal feedback timeline
        feedback_list = await db.feedback.find({
            "employee_id": ObjectId(current_user.id)
        }).to_list(None)
        
        sentiment_breakdown = {"positive": 0, "neutral": 0, "negative": 0}
        for feedback in feedback_list:
            sentiment_breakdown[feedback["sentiment"]] += 1
        
        recent_feedback = await db.feedback.find({
            "employee_id": ObjectId(current_user.id)
        }).sort("created_at", -1).skip(offset).limit(limit).to_list(None)
        
        recent_feedback = [Feedback(**convert_objectid_to_str(f)) for f in recent_feedback]
    
    return DashboardStats(
        total_feedback=len(feedback_list),
        sentiment_breakdown=sentiment_breakdown,
        recent_feedback=recent_feedback
    )