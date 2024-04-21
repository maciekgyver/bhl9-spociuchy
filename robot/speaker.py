from gpiozero import PWMOutputDevice
import time

from notes import *


def get_melody(m):
    return {
        "M": melody,
        "J": jingle_bells,
        "H": happy_birthday
    }[m]


class Speaker:
    def __init__(self, pin):
        self._pwm = PWMOutputDevice(pin=pin, active_high=True, initial_value=0, frequency=0)
    
    # Function to play a tone at a given frequency and duration
    def play_tone(self, note, duration):
        self._pwm.frequency = note_to_frequency[note]  # Get frequency from the notes dictionary
        self._pwm.value = 0.5

        # Play the tone for the specified duration
        time.sleep(duration)

    def play_melody(self, melody):    
        for note, duration in get_melody(melody):
            self.play_tone(note, duration)

    def turn_off(self):
        self._pwm.value = 0
