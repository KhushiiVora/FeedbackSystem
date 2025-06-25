from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class FeedbackSentiment(str, Enum):
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"

class FeedbackCreate(BaseModel):
    employee_id: str
    strengths: str
    areas_to_improve: str
    sentiment: FeedbackSentiment

class FeedbackUpdate(BaseModel):
    strengths: Optional[str] = None
    areas_to_improve: Optional[str] = None
    sentiment: Optional[FeedbackSentiment] = None

class Feedback(BaseModel):
    id: str = Field(alias="_id")
    manager_id: str
    employee_id: str
    strengths: str
    areas_to_improve: str
    sentiment: FeedbackSentiment
    acknowledged: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class DashboardStats(BaseModel):
    total_feedback: int
    sentiment_breakdown: dict
    recent_feedback: List[Feedback]