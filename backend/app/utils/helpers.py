from bson import ObjectId
from datetime import datetime

def convert_objectid_to_str(doc):
    """Convert MongoDB ObjectId to string and ensure timestamp fields"""
    if doc:
        doc["_id"] = str(doc["_id"])
        if "manager_id" in doc and doc["manager_id"]:
            doc["manager_id"] = str(doc["manager_id"])
        if "employee_id" in doc and doc["employee_id"]:
            doc["employee_id"] = str(doc["employee_id"])
        
        # Ensure timestamp fields are present
        if "created_at" not in doc or doc["created_at"] is None:
            doc["created_at"] = datetime.utcnow()
        if "updated_at" not in doc or doc["updated_at"] is None:
            doc["updated_at"] = doc["created_at"]
    return doc

def validate_object_id(id_string: str) -> bool:
    """Validate if string is valid ObjectId"""
    try:
        ObjectId(id_string)
        return True
    except:
        return False