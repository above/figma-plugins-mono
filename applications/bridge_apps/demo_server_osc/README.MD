# demo_server_osc

## Description

This bridge listens to Open Sound Control messages and relays it as Socket.io events.

In it's current state it handles 1x message+value and sends it as event+value

## Instructions

- Install [NodeJS and NPM](https://nodejs.org/en/download/)
- Navigate to /figma-node-demo/demo_server* in a terminal
- Run `$ npm install` to install needed Node Modules
- Edit the file "app.js" as needed (see Settings):
- Run the server with `$ npm start`

## Settings

**Settings in 'app.js'**

- Server port, set to the same as Figma plugin
- OSC Address
- OSC port

## Todo

Handle multiple values and bundles
