#!/usr/bin/python
import cwiid
import time
import socket
import os, os.path


button_delay = 0.1

print 'Press 1 + 2 on your Wii Remote now ...'
time.sleep(1)

# Connect to the Wii Remote. If it times out
# then quit.
try:
  wii=cwiid.Wiimote()
except RuntimeError:
  print "Error opening wiimote connection"
  quit()

if os.path.exists("/tmp/app.zumobot"):
  client = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
  client.connect("/tmp/app.zumobot")
  print "Python client connected to zumobot socket"
else:
  print "Python client could not connect to socket"


print 'Wii Remote connected...\n'
print 'Press some buttons!\n'
print 'Press PLUS and MINUS together to disconnect and quit.\n'

wii.rpt_mode = cwiid.RPT_BTN

btnSet = set()
prevBtnSet = set()

while True:

  prevBtnSet = set(btnSet)
  btnSet.clear()

  buttons = wii.state['buttons']

  # If Plus and Minus buttons pressed
  # together then rumble and quit.
  if (buttons - cwiid.BTN_PLUS - cwiid.BTN_MINUS == 0):
    print '\nClosing connection ...'
    wii.rumble = 1
    time.sleep(1)
    wii.rumble = 0
    exit(wii)

  # Check if other buttons are pressed by
  # doing a bitwise AND of the buttons number
  # and the predefined constant for that button.
  if (buttons & cwiid.BTN_LEFT):
    btnSet.add("left")
    time.sleep(button_delay)

  if(buttons & cwiid.BTN_RIGHT):
    btnSet.add("right")
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_UP):
    btnSet.add("up")
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_DOWN):
    btnSet.add("down")
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_1):
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_2):
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_A):
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_B):
    btnSet.add("fireButton")
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_HOME):
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_MINUS):
    time.sleep(button_delay)

  if (buttons & cwiid.BTN_PLUS):
    time.sleep(button_delay)

  downBtnSet = btnSet.difference(prevBtnSet)
  upBtnSet = prevBtnSet.difference(btnSet)

  for downBtn in downBtnSet:
    client.send("d"+downBtn)

  for upBtn in upBtnSet:
    client.send("u"+upBtn)
