from datetime import datetime
import json
from typing import Any
from sqlalchemy import CursorResult, create_engine, text

from activity_model import ActivityModel
from params import CONNECTION_STR
from queries import ACTIVITY_INSERT_QUERY, GET_ACTIVE_ACTIVITIY_QUERY, GET_ACTIVITIES_QUERY, VOTE_INSERT_QUERY
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
                print(conn.execute(text(VOTE_INSERT_QUERY), vote.model_dump()))
                conn.commit()
                return
            except Exception as e:
                print(e)
                return e

    def get_activities(self) -> CursorResult[Any]:
        with self._engine.connect() as conn:
            try:
                results = conn.execute(text(GET_ACTIVITIES_QUERY)).fetchall()
                print(results)
                activity_dicts = [dict(row) for row in results]
                print(activity_dicts)
                json_result = json.dumps(activity_dicts)
                return json_result
            except Exception as e:
                print(e)
                return json.dumps({"error": str(e)})
                
    def get_active_poll(self, current_timestamp: datetime, card_number: str) -> CursorResult[Any]:
        with self._engine.connect() as conn:
            try:
                result = conn.execute(text(GET_ACTIVE_ACTIVITIY_QUERY), {"current_timestamp": current_timestamp, "card_number": card_number}).fetchone()
                if not result:
                    return
                return {"id": result[0], "question": result[1], "duration": (result[2] - datetime.now()), "group": result[3]}
            except Exception as e:
                print(e)
                return e
