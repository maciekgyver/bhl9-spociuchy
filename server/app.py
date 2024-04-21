from datetime import datetime
from fastapi import FastAPI, Query
import uvicorn

from activity_model import ActivityModel
from db_interface import DBInterface
from vote_model import VoteModel


app = FastAPI()

send_robot = {"action": False}


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/get-activities")
def get_activities():
    db_interface = DBInterface()
    activities = db_interface.get_activities()
    print(activities)
    return activities

@app.get("/get-activity/{activity_id}")
def get_activity(activity_id: int):
    db_interface = DBInterface()
    result = db_interface.get_activitie(activity_id)
    if not result:
        return {}
    return result

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
    result = db_interface.insert_vote(vote)
    if not vote.vote:
        send_robot["action"] = True    
    if not result:
        return {"message": "Vote received"}
    return {"message": "Failed to insert vote"}

@app.get("/get-active-poll/{card_number}")
def get_active_poll(card_number: str):
    db_interface = DBInterface()
    result = db_interface.get_active_poll(datetime.now(), card_number)
    if not result:
        return {}
    return result

@app.get("/get-active-poll")
def get_active_poll():
    db_interface = DBInterface()
    result = db_interface.get_active_poll(datetime.now())
    if not result:
        return {}
    return result

@app.get("/get-groups")
def get_groups():
    db_interface = DBInterface()
    result = db_interface.get_groups()
    if not result:
        return {}
    return result

@app.post("/start_program")
def start_program():
    if not send_robot["action"]:
        return {"action": False}
    send_robot["action"] = False
    return {"action": True}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
