const fs = require("fs");
const mqtt = require("mqtt");
const bigJson = require("big-json");

const brokerUrl = "mqtt://localhost:1883";
const topic = "sensor/clientsimulator";

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  client.publish("sensor/data/clientsimulator", "Hello MQTT");
});
