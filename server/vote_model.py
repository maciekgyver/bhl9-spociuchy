from datetime import datetime
import json
from pydantic import BaseModel, model_validator


class VoteModel(BaseModel):
    activity_id: int
    user_card_number: str
    vote: bool

    @model_validator(mode="before")
    @classmethod
    def validate_to_json(cls, value):
        if isinstance(value, str):
            return cls(**json.loads(value))
        return value
