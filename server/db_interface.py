from typing import Any
from sqlalchemy import CursorResult, create_engine, text

from activity_model import ActivityModel
from params import CONNECTION_STR
from queries import ACTIVITY_INSERT_QUERY, VOTE_INSERT_QUERY
from vote_model import VoteModel

class DBInterface:
    def __init__(self):
        self._engine = create_engine(CONNECTION_STR)
    
    def insert_activity(self, activity: ActivityModel) -> CursorResult[Any]:
        with self._engine.connect() as conn:
            try:
                activity_id = conn.execute(text(ACTIVITY_INSERT_QUERY), activity.model_dump()).fetchone()[0]
                conn.commit()
                print(activity_id)
                return activity_id
            except Exception as e:
                print(e)
                return e
            
    def insert_vote(self, vote: VoteModel) -> CursorResult[Any]:
        with self._engine.connect() as conn:
            try:
                conn.execute(text(VOTE_INSERT_QUERY), vote)
                conn.commit()
                return
            except Exception as e:
                return e
