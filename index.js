const fs = require("fs");
const mqtt = require("mqtt");
const bigJson = require("big-json");

function parseLargeJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const parseStream = bigJson.createParseStream();

    readStream.pipe(parseStream);

    parseStream.on("data", (jsonData) => {
      resolve(jsonData); // Sobald die Datei vollständig geparst ist
    });

    parseStream.on("error", (error) => {
      reject(`JSON Parsing Error: ${error}`);
    });
  });
}

const brokerUrl = "mqtt://localhost:1883";
const topic = "sensor/clientsimulator";

const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  client.publish("sensor/data/clientsimulator", "Hello MQTT");
});
