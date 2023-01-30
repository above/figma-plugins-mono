/*
 * Node Figma Demo Server Serial. 
 *
 * Node server template to 
 *    1. Receive Serial data 
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

const { SerialPort } = require('serialport');
const { Readline } = require('@serialport/parser-readline');
const { ReadlineParser } = require('@serialport/parser-readline')

//------------- Config -------------

// Set port for express server
const PORT = 3000;

// Set name of Serial Port that is used
// It should look something like
//  Mac/Linux'/dev/ttyUSB111'
//  Windows: 'COM3'
const SERIAL_PORT_NAME = 'NAME_OF_SERIAL_PORT';

// Set Baudrate of Serial connection
const BAUDRATE = 115200;

const serial_port = new SerialPort({
  path: SERIAL_PORT_NAME,
  baudRate: BAUDRATE,
  parser: Readline

});

//------------- Init Serial-------------

serial_port.on('open', function() {
  console.log('Serial port opened', SERIAL_PORT_NAME);
  const parser = serial_port.pipe(new ReadlineParser({ delimiter: '\r\n' }))

  // Reading Serial messages as "Message|Message Value"
  parser.on('data', data => {
    console.log('Message received', data);
    let msg = data.split("|")[0];
    let val  = data.split("|")[2];
    sendMessage(msg, val);
  });
});

//------------- Send Message Function -------------

function sendMessage(msg, val) {

  console.log(`Sending message: '${msg}:${val}'`);

  io.emit(msg, val);
}

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
  console.log("server listening on *:" + PORT);
});
