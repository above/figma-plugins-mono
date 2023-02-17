# demo_server_serial

## Description

This bridge reads serial data and relays it as Socket.io events.

In it's current state it uses the format "MESSAGE|MESSAGE_VALUE

For example, if using an Arduino as input:
```
Serial.println("BUTTON_1|1" )
```

## Instructions

- Install [NodeJS and NPM](https://nodejs.org/en/download/)
- Navigate to /figma-node-demo/demo_server* in a terminal
- Run `$ npm install` to install needed Node Modules
- Edit the file "app.js" as needed (see Settings):
- Run the server with `$ npm start`

## Settings

**Settings in 'app.js'**

- Server PORT, set to the same as Figma plugin
- SERIAL_PORT_NAME (Mac/Linux'/dev/ttyUSB111', Windows: 'COM3')
- BAUDRATE
