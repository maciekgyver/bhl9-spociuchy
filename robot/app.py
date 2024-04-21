from robot import Robot
from motor import Motor
from interpreter import Interpreter
from speaker import Speaker
import argparse
import requests
from time import sleep


parser = argparse.ArgumentParser(description="This script demonstrates argument parsing.")
parser.add_argument("program_file", help="Path to the program file")

args = parser.parse_args()
program_file = args.program_file

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

# URL of the FastAPI endpoint
url = "http://172.20.10.3:8000/start_program"
while(True):
    response = requests.post(url)
    print("dupa")
    mess = response.json()
    if mess["action"]:
        interpreter.execute_program()
    sleep(5)
