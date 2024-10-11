const fs = require("fs");
const bigJson = require("big-json");
const https = require("https");
const axios = require("axios").default;

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

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

data = null;
i = 0;
url = "https://localhost:5050/api/Test";

// Verwendung der Funktion
parseLargeJsonFile("./mqtt_messages_2.json")
  .then((jsonData) => {
    console.log("JSON erfolgreich geparst");
    data = jsonData;

    setInterval(() => {
      toSend = data[i];
      toSend.message.timestamp = new Date().toISOString();
      console.log("Sending data: ", data[i]);

      axios
        .post(url, toSend, {
          headers: { "Content-Type": "application/json" },
          httpsAgent: httpsAgent,
        })
        .then((res) => {
          console.log(`statusCode: ${res.status}`);
        })
        .catch((error) => {
          console.error("Fehler:", error);
        });

      i++;
    }, 5000);
  })
  .catch((error) => {
    console.error("Fehler:", error);
  });
