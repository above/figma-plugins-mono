/*
 * Node Figma Demo Server
 *
 * A simple node server template to 
 *    1. Receive MQTT messages 
 *    2. Relay messages with Socket.IO
 * 
 * This particular example is is using subcribes to 5 topics corresponding to
 * 5 button inputs
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

const mqtt = require('mqtt')

//------------- Config -------------

// Set port for express server
const PORT = 3000;

// Set URL for broker
const MQTT_URL = "mqtt://127.0.0.1";

// Set MQTT options,
// change Id and add username/pwd as needed
const MQTT_OPTIONS = {
  clientId: 'MyMQTT',
  port: 1883,
  keepalive: 60
};

//------------- Subscribe to MQTT topics -------------

const mqtt_client = mqtt.connect(MQTT_URL, MQTT_OPTIONS);

mqtt_client.on('connect', function () {
  mqtt_client.subscribe('/button/1', function (err) {
    if (!err) {
      console.log("MQTT subscribed to '/button/1'")
    } else {
      console.log(err);
    }
  })
  mqtt_client.subscribe('/button/2', function (err) {
    if (!err) {
      console.log("MQTT subscribed to '/button/2'")
    } else {
      console.log(err);
    }
  })
  mqtt_client.subscribe('/button/3', function (err) {
    if (!err) {
      console.log("MQTT subscribed to '/button/3'")
    } else {
      console.log(err);
    }
  })
  mqtt_client.subscribe('/button/4', function (err) {
    if (!err) {
      console.log("MQTT subscribed to '/button/4'")
    } else {
      console.log(err);
    }
  })
  mqtt_client.subscribe('/button/5', function (err) {
    if (!err) {
      console.log("MQTT subscribed to '/button/5'")
    } else {
      console.log(err);
    }
  })

})

//------------- Handle MQTT Messages -------------

mqtt_client.on('message', function (topic, msg) {
  let msg_str = msg.toString();
  console.log(`MQTT message: ${msg_str}`)

  if (topic == "/button/1") {
    switch (msg_str) {
      case "PRESS":
        console.log("button 1 pressed");
        io.emit("BUTTON_1", "PRESS");
        break;
      case "RELEASE":
        console.log("button 1 released");
        io.emit("BUTTON_1", "RELEASE");
        break;
      default:
        break;
    }
  }

  if (topic == "/button/2") {
    switch (msg_str) {
      case "PRESS":
        console.log("button 1 pressed");
        io.emit("BUTTON_2", "PRESS");
        break;
      case "RELEASE":
        console.log("button 2 released");
        io.emit("BUTTON_2", "RELEASE");
        break;
      default:
        break;
    }
  }
  if (topic == "/button/3") {
    switch (msg_str) {
      case "PRESS":
        console.log("button 3 pressed");
        io.emit("BUTTON_3", "PRESS");
        break;
      case "RELEASE":
        console.log("button 3 released");
        io.emit("BUTTON_3", "RELEASE");
        break;
      default:
        break;
    }
  }
  if (topic == "/button/4") {
    switch (msg_str) {
      case "PRESS":
        console.log("button 4 pressed");
        io.emit("BUTTON_4", "PRESS");
        break;
      case "RELEASE":
        console.log("button 4 released");
        io.emit("BUTTON_4", "RELEASE");
        break;
      default:
        break;
    }
  }
  if (topic == "/button/5") {
    switch (msg_str) {
      case "PRESS":
        console.log("button 5 pressed");
        io.emit("BUTTON_5", "PRESS");
        break;
      case "RELEASE":
        console.log("button 5 released");
        io.emit("BUTTON_5", "RELEASE");
        break;
      default:
        break;
    }
  }

})

//------------- Handle Socket.io Connection -------------

io.on('connection', (socket) => {
  console.log('a user connected');
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

//------------- Serve -------------

app.use("/", express.static("public"));

server.listen(PORT, () => {
  console.log("server listening on *:" + PORT);
});
