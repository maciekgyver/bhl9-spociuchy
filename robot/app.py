from robot import Robot
from motor import Motor
from interpreter import Interpreter


def main():
    LEFT_PWM = 13
    LEFT_FORWARD = 26
    LEFT_REVERSE = 19

    RIGHT_PWM = 16
    RIGHT_FORWARD = 21
    RIGHT_REVERSE = 20

    left_motor = Motor(
        LEFT_PWM,
        LEFT_FORWARD,
        LEFT_REVERSE
    )

    right_motor = Motor(
        RIGHT_PWM,
        RIGHT_FORWARD,
        RIGHT_REVERSE
    )

    robot = Robot(left_motor, right_motor)
    interpreter = Interpreter(robot, "program.json")
    interpreter.execute_program()


if __name__ == "__main__":
    main()
