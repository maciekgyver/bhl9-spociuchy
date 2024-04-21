from datetime import datetime
import json
from pydantic import BaseModel, model_validator


class ActivityModel(BaseModel):
    question: str
    created_at: datetime
    expires_at: datetime
    group_id: int

    @model_validator(mode="before")
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value
