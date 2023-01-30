/*
 * Node Figma Demo Server OSC. 
 *
 * Node server template to 
 *    1. Receive OSC data
 *    2. Relay messages with Socket.IO
 * 
 * Made to work with local Figma plugins, please see README.md
 * 
 * Above 2022
*/

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { Server: ServerOSC } = require('node-osc');

//------------- Config -------------

// Set port for express server
const PORT = 3000;

// Set port for OSC server
const OSC_PORT = 5007;

// Set port for OSC address
const OSC_ADDRESS = '0.0.0.0';

// Create OSC Server
const oscServer = new ServerOSC(OSC_PORT, OSC_ADDRESS, () => {
  console.log(`OSC Server is listening on: ${OSC_PORT}`);
});

//------------- OSC listen -------------

// Listening to OSC messages and relays them as socket.io events
oscServer.on('message', function (msg) {

  //Remove leading "/" before publishing
  const msgID = msg[0].split('/')[1];
  const msgVal = msg[1];

  // emit event with messageID and Value
  io.emit(`${msgID}`, `${msgVal}`);
});

//------------- Handle Socket.io Connections -------------

io.on('connection', (socket) => {
  console.log('A user connected');
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//------------- Serve -------------

app.use("/", express.static("public"));

server.listen(PORT, () => {
  console.log(`Express server listening on *:${PORT}`);
});
