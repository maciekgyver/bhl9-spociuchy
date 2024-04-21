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
            execute_instruction(i)

    def execute_instruction(self, instruction):
        match i["action"]:
            case "F":
                self._robot.reverse_drive(i["speed"])
            case "R":
                self._robot.forward_drive(i["speed"])
            case "SL":
                self._robot.spin_left(i["speed"])
            case "SR":
                self._robot.spin_right(i["speed"])
            case "P":
                self._robot.play_melody(i["melody"])
                self._robot.turn_off_spreaker()
                return 
        sleep(i["time"])
        self._robot.stop()
