from gpiozero import PWMOutputDevice
from gpiozero import DigitalOutputDevice


class Motor:
    """
    All params are numbers of raspberry pins used to connect the motor.
    """
    def __init__(self, pwm, forward, reverse):
        self._pwm = PWMOutputDevice(pin=pwm, active_high=True, initial_value=0, frequency=1000)
        self._forward = DigitalOutputDevice(forward)
        self._reverse = DigitalOutputDevice(reverse)

    @property
    def pwm(self):
        return self._pwm

    @pwm.setter
    def pwm(self, value):
        self._pwm.value = value

    @property
    def forward():
        return self._forward

    @forward.setter
    def forward(self, value):
        self._forward.value = value

    @property
    def reverse(self):
        return self._reverse

    @reverse.setter
    def reverse(self, value):
        self._reverse.value = value

    def stop(self):
        self.forward = False
        self.reverse = False
        self.pwm = 0.0

    def forward_drive(self, value):
        self.forward = True
        self.reverse = False
        self.pwm = value

    def reverse_drive(self, value):
        self.forward = False
        self.reverse = True
        self.pwm = value
