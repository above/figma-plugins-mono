# demo_server_mqtt

## Description

This bridge reads MQTT messages and relays it as Socket.io events.

## Instructions

- Install [NodeJS and NPM](https://nodejs.org/en/download/)
- Navigate to /figma-node-demo/demo_server* in a terminal
- Run `$ npm install` to install needed Node Modules
- Edit the file "app.js" as needed (see Settings):
- Run the server with `$ npm start`

## Settings

**Settings in 'app.js'**

- Server port, set to the same as Figma plugin
- MQTT URL
- MQTT port
- Subscribe to the topics used by your device
- Handle messages, ie what Socket.io it will send
- Edit what event and data to emit over Socket.io
