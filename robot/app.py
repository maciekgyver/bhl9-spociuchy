from robot import Robot
from motor import Motor
from interpreter import Interpreter
from speaker import Speaker
import argparse
from fastapi import FastAPI
import uvicorn


parser = argparse.ArgumentParser(description="This script demonstrates argument parsing.")
parser.add_argument("program_file", help="Path to the program file")

args = parser.parse_args()
program_file = args.program_file

app = FastAPI()

LEFT_MOTOR_PWM = 13
LEFT_MOTOR_FORWARD = 26
LEFT_MOTOR_REVERSE = 19

RIGHT_MOTOR_PWM = 16
RIGHT_MOTOR_FORWARD = 21
RIGHT_MOTOR_REVERSE = 20

SPEAKER_PIN = 12

left_motor = Motor(
    LEFT_MOTOR_PWM,
    LEFT_MOTOR_FORWARD,
    LEFT_MOTOR_REVERSE
)

right_motor = Motor(
    RIGHT_MOTOR_PWM,
    RIGHT_MOTOR_FORWARD,
    RIGHT_MOTOR_REVERSE
)

speaker = Speaker(SPEAKER_PIN)

robot = Robot(left_motor, right_motor, speaker)

interpreter = Interpreter(robot, program_file)

@app.post("/start_program")
async def start_program():
    if program_file:
        interpreter.execute_program()
        return {"message": "Program started successfully."}
    else:
        raise HTTPException(status_code=400, detail="Missing program_file parameter.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
