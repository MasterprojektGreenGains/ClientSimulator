// Funktion zum Parsen einer großen JSON-Datei
export function parseLargeJsonFile(filePath) {
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
