import json
from time import sleep


class Interpreter:
    def __init__(self, robot, program_file):
        self._robot = robot
        self.load_data_from_json(program_file)

    def load_data_from_json(self, program_file):
        with open(program_file, "r") as read_file:
            self._instructions = json.load(read_file)["instructions"]

    def execute_program(self):
        for i in self._instructions:
            match i["action"]:
                case "F":
                    self._robot.reverse_drive(i["speed"])
                case "R":
                    self._robot.forward_drive(i["speed"])
                case "SL":
                    self._robot.spin_left(i["speed"])
                case "SR":
                    self._robot.spin_right(i["speed"])
            sleep(i["time"])