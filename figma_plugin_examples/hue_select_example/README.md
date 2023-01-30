# Hue Select Figma Plugin Example

## Description

This is an example plugin for Figma made to demonstrate how to get going with real-time hardware interactivity in Figma prototypes. 

The plugin is listening to events over socket.io in order to update the current scene. It shows how to rotate frames, set fill color and text. 

You can use one of the bridge apps in this repo to relay sockets from Serial, OSC or MQTT,
or simply send sockets directly from your hardware.

The example is reading 3 types of events:
   "SELECT" for a the switch
   "ROTARY_CW" for clockwise rotation
   "ROTARY_CCW" for counterclockwise rotation

![Hue Select Gif](../../assets/hue_select.gif?raw=true)

## Setup

Follow the setup instructions in the /figma-plugins-mono/README.md 

