import { parseLargeJsonFile } from "./parseLargeJson";

const fs = require("fs");
const bigJson = require("big-json");
const https = require("https");
const axios = require("axios").default;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

data = null;
i = 0;
url = "https://localhost:5050/api/Test/sensor/data";

// Verwendung der Funktion
parseLargeJsonFile("./mqtt_messages_2.json")
  .then((jsonData) => {
    console.log("JSON erfolgreich geparst");
    data = jsonData;

    setInterval(() => {
      toSend = data[i];
      toSend.message.timestamp = new Date().toISOString();

      // //take timestamp 1 month back
      // toSend.message.timestamp = new Date(
      //   new Date(toSend.message.timestamp).setMonth(
      //     new Date(toSend.message.timestamp).getMonth() - 1
      //   )
      // ).toISOString();+

      // //take timestamp 1 week back
      // toSend.message.timestamp = new Date(
      //   new Date(toSend.message.timestamp).setDate(
      //     new Date(toSend.message.timestamp).getDate() - 7
      //   )
      // ).toISOString();

      // //take timestamp 1 day back
      // toSend.message.timestamp = new Date(
      //   new Date(toSend.message.timestamp).setDate(
      //     new Date(toSend.message.timestamp).getDate() - 1
      //   )
      // ).toISOString();

      // // take timestamp 1 hour back
      // toSend.message.timestamp = new Date(
      //   new Date(toSend.message.timestamp).setHours(
      //     new Date(toSend.message.timestamp).getHours() - 1
      //   )
      // ).toISOString();

      // console.log("Sending data: ", data[i]);
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
