# Rotary Toggle Figma Plugin Example

## Description

This is an example plugin for Figma made to demonstrate how to get going with real-time hardware interactivity in Figma prototypes. 

The plugin is listening to events over socket.io in order to update the current scene. 
It shows how to rotate a frame and set the position of a toggle switch. 

You can use one of the bridge apps in this repo to relay Socket.io events from Serial, OSC or MQTT,
or simply send Socket.io events directly from your hardware.

The example is reading 3 types of events:
   "SELECT" for a the switch
   "ROTARY_CW" for clockwise rotation
   "ROTARY_CCW" for counterclockwise rotation

![Hue Select Gif](../../assets/rotary_toggle.gif?raw=true)

## Setup
Follow the instructions in the /figma-plugins-mono/README.md 

