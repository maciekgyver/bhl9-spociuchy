from fastapi import FastAPI
import uvicorn

from activity_model import ActivityModel
from db_interface import DBInterface
from vote_model import VoteModel


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/get-activities")
def get_activities():
    activities = [
    {
        "id": 1,
        "question": "question 1",
        "created_at": 1713634879498,
        "expires_at": 1713634879498,
        "group": "group_1"
    },
    {
        "id": 2,
        "question": "test question 2",
        "created_at": 1713634694439,
        "expires_at": 1713634694439,
        "group": "group_1"
    },
    {
        "id": 3,
        "question": "test question 3",
        "created_at": 1713634694439,
        "expires_at": 1713634694439,
        "group": "group_1"
    },
    ]
    return activities

@app.get("/get-activity/{activity_id}")
def get_activity(activity_id: int):
    activity = {
        "id": 1,
        "question": "question 1",
        "timestamp": 1713634879498,
        "group": "group_1",
        "accepted": ["Maciej Boruwa", "Sebastian Adidas"],
        "rejected": ["Jacek Placek", "Laura Dynia"]
        }
    return activity

@app.get("/get-groups")
def get_groups():
    groups = ["group_1", "group_2", "group_3"]
    return groups

@app.post("/add-activity")
def add_activity(activity: ActivityModel):
    db_interface = DBInterface()
    result = db_interface.insert_activity(activity)
    if not result:
        return {"message": "Failed to insert activity"}
    return {"message": "Activity received", "activity_id": result}

@app.post("/add-vote")
def add_vote(vote: VoteModel):
    db_interface = DBInterface()
    result = db_interface.insert_activity(vote)
    if not result:
        return {"message": "Vote received"}
    return {"message": "Failed to insert vote"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
