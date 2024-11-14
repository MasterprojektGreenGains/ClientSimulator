const fs = require("fs");
const bigJson = require("big-json");
const mqtt = require("mqtt");

// Funktion zum Parsen einer großen JSON-Datei
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

// MQTT-Konfigurationsdaten
const mqttHost = "mqtt://localhost"; // Passe den MQTT-Broker an
const topic = "sensor/data"; // Passe das MQTT-Topic an

// Verbindung zum MQTT-Broker herstellen
const client = mqtt.connect(mqttHost);

client.on("connect", () => {
  console.log("Mit dem MQTT-Broker verbunden");

  parseLargeJsonFile("./mqtt_messages_2.json")
    .then((jsonData) => {
      console.log("JSON erfolgreich geparst");
      let data = jsonData;
      let i = 0;

      setInterval(() => {
        if (i >= data.length) {
          console.log("Alle Nachrichten wurden gesendet.");
          client.end();
          return;
        }

        let toSend = data[i];
        toSend.message.timestamp = new Date().toISOString();

        // MQTT-Nachricht senden
        client.publish(topic, JSON.stringify(toSend), { qos: 0 }, (error) => {
          if (error) {
            console.error("Fehler beim Senden:", error);
          } else {
            console.log(`Nachricht gesendet: ${JSON.stringify(toSend)}`);
          }
        });

        i++;
      }, 5000);
    })
    .catch((error) => {
      console.error("Fehler beim Parsen der JSON-Datei:", error);
    });
});

client.on("error", (error) => {
  console.error("Fehler bei der MQTT-Verbindung:", error);
});
