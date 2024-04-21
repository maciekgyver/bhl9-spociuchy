from time import sleep

from motor import Motor
from interpreter import Interpreter

MAGIC_CONSTANT = 1.0
 

class Robot:
	def __init__(self, left_motor, right_motor, speaker):
		self._left_motor = left_motor
		self._right_motor = right_motor
		self._speaker = speaker
 
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

	def play_melody(self, melody):
		self._speaker.play_melody(melody)

	def turn_off_spreaker(self):
		self._speaker.turn_off()
 