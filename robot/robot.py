from time import sleep

from motor import Motor
from interpreter import Interpreter

MAGIC_CONSTANT = 1.0
 

class Robot:
	def __init__(self, left_motor, right_motor):
		self._left_motor = left_motor
		self._right_motor = right_motor
 
	def stop(self):
		self._left_motor.stop()
		self._right_motor.stop()

	def forward_drive(self, value):
		self._left_motor.forward_drive(value * MAGIC_CONSTANT)
		self._right_motor.forward_drive(value)
	
	def reverse_drive(self, value):
		self._left_motor.reverse_drive(value * MAGIC_CONSTANT)
		self._right_motor.reverse_drive(value)
	
	def spin_left(self, value):
		self._left_motor.reverse_drive(value * MAGIC_CONSTANT)
		self._right_motor.forward_drive(value)
	
	def spin_right(self, value):
		self._left_motor.forward_drive(value * MAGIC_CONSTANT)
		self._right_motor.reverse_drive(value)
 
# def forwardTurnLeft():
# 	forwardLeft.value = True
# 	reverseLeft.value = False
# 	forwardRight.value = True
# 	reverseRight.value = False
# 	driveLeft.value = 0.2
# 	driveRight.value = 0.8
 
# def forwardTurnRight():
# 	forwardLeft.value = True
# 	reverseLeft.value = False
# 	forwardRight.value = True
# 	reverseRight.value = False
# 	driveLeft.value = 0.8
# 	driveRight.value = 0.2
 
# def reverseTurnLeft():
# 	forwardLeft.value = False
# 	reverseLeft.value = True
# 	forwardRight.value = False
# 	reverseRight.value = True
# 	driveLeft.value = 0.2
# 	driveRight.value = 0.8
 
# def reverseTurnRight():
# 	forwardLeft.value = False
# 	reverseLeft.value = True
# 	forwardRight.value = False
# 	reverseRight.value = True
# 	driveLeft.value = 0.8
# 	driveRight.value = 0.2
