const http = require("http");
const { WebSocketServer } = require("ws");
//TODO: Implement EMAIL (SMTP)
const crypto = require('crypto');
const fs = require("fs");
const port = 8080;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost"); //Gestattet Zugriff von der Hauptseite auf den POST Handler
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); //Erlaubt die genannten methoden, die sonst von CORS blockiert werden
    res.setHeader("Access-Control-Allow-Headers", "Content-Type"); //Erlaubt Content-Type Header

    if (req.method === "OPTIONS") { //Wenn client OPTIONS anfordert
        res.writeHead(204); //Antworte "Success, no content"
        res.end();
        return;
    } else if (req.method === "GET") { //Wenn eine UUID angefordert wird
        const expiry = new Date(Date.now() + 31557600000).toUTCString();
        res.setHeader("Expires", expiry); //Setze den Cache Control Header der Antwort auf das Jetzt + 1 Jahr

        const file = "users.list";
        const id = crypto.randomUUID(); //Generiert eine UUID(v4)
        fs.appendFile(file, id + "\n", (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" }); //Falls die Datei nicht gelesen werden kann, sende Fehlermeldung
                res.end(JSON.stringify({ success: false, id: 0 })); //Sende keine daten
            } else {
                console.log(`ID "${id}" saved to ${file} and sent`);
                res.writeHead(200, { "Content-Type": "application/json" }); //Sende "erfolgreich"
                res.end(JSON.stringify({ success: true, id: id })); //Sende UUID, die der browser im cache speichert
            }
        });
    } else if (req.method === "POST" && req.url === "/submit") { //Wenn eine Bestellung gespeichert werden soll
        let body = "";
        req.on("data", (data) => { //Sobald daten ankommen
            body += data; //Werden sie an den body angehängt
        });
        req.on("end", () => { //Sobald die Übertragung vollständig ist
            const postData = JSON.parse(body); //Werden die übertragenen Daten von einem SJON String in ein Objekt geparsed
            const { file, id, surname, name, course, email, items } = postData; //Dieses Dekonstruiert

            fs.appendFile(file, id + "\t" + surname + "\t" + name + "\t" + course + "\t" + email + "\t" + items + "\n", (err) => { // Und der Inhalt korrekt formatiert in eine tsv datei gespeichert //TODO: Write additional item information
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" }); //Falls die Datei nicht gelesen werden kann, sende Fehlermeldung
                    res.end(JSON.stringify({ success: false, id: 0 })); //Sende keine daten
                } else {
                    console.log(`Order from "${id}" saved to ${file}`);
                    res.writeHead(200, { "Content-Type": "application/json" }); //Sende "Erfolgreich"
                    res.end(JSON.stringify({ success: true, id: id })); //Sende die ID an den client //TODO: Implement client cross check if order was right
                }
            });
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" }); //Falls keine dieser Methoden genutzt wird, wird die Anfrage stilecht mit einem 404 beantwortet
        res.end("Not Found");
    }
});

const wss = new WebSocketServer({ server });
let clients = new Set(); //Liste aller Nutzer
let watchlist = new Set(); //Liste aller Dateien von denen Nutzer Updates erhalten sollen

wss.on("connection", (ws) => { //Wenn ein nutzer sich verbindet
    console.log("Client connected");

    ws.on("message", (message) => { //Wenn der WSS eine Nachricht erhält
        const messageObj = JSON.parse(message); //Parse die Nachricht zu eine JSON Objekt

        console.log(`Received: ${message}`);

        const { file, method, data } = messageObj; //Dekonstruiere dieses
        let orders = fs.readFileSync(file, "utf8").split("\n"); //Orders ist eine tabelle die as jeder row der tsv besteht
        console.log(orders);

        if (method === "SUB") { //Wenn der nutzer updates zu einer datei erhalten möchte
            clients.add(ws); //füge ihn zu clients hinzu
            const data = fs.readFileSync(file, "utf-8"); //lese die datei ein

            if (!watchlist.has(file)) { //Falls die datei nicht bereits auf der watchlist ist
                watchlist.add(file); //Tue sie auf die watchlist

                let fileContent = fs.readFileSync(file, "utf8"); // der inhalt der datei zum zeitpunkt der ergänzung auf die watchlist
                let fileSize = fileContent.split("\n").length; // die zahl der rows zum zeitpunkt der ergänzung zur watchlist
                fs.watchFile(file, (curr, prev) => { //löst callback bei jeder änderung der datei aus
                    if (curr.mtime > prev.mtime) { //Wenn es zu einer relevanten änderung kommt
                        const content = fs.readFileSync(file, 'utf8'); //lese den neuen inhalt der datei ein
                        let newFileSize = content.split("\n").length; //und die neue länge der datei

                        if (newFileSize > fileSize) { // falls die neue datei mehr zeilen hat als die alte //FIXME: When there are additions AND changes the handler notes the changes as additions
                            fileContent = fileContent.split("\n");
                            let addedContent = content.split("\n").filter(element => !fileContent.includes(element)); //Gibt uns nur die Zeilen die NICHT in der alten version vorhanden sind
                            addedContent = addedContent.map(element => [element, content.split("\n").indexOf(element)]); //ERgänzt die zeile, in der die änderungen vorkommmen
                            clients.forEach((client) => { //Sende an jeden client
                                client.send(JSON.stringify({ successful: true, method: "ADD", data: addedContent })); //Erfolgreich, "neuer Inhalt", Inhalt
                            });
                        } else if (newFileSize < fileSize) { //Falls die alte datei länger ist als die neue
                            let newFileContent = content.split("\n");
                            let deletedContent = fileContent.split("\n").filter(element => !newFileContent.includes(element)); //Gibt uns nur die zeilen die in der neuen version fehlen
                            clients.forEach((client) => {
                                client.send(JSON.stringify({ successful: true, method: "REM", data: deletedContent })); //ERfolgreich, "Entfernt", entfernte inhalte
                            });
                        } else { //Falls nur der inhalt der zeilen geändert wurde
                            fileContent = fileContent.split("\n");
                            let changedContent = content.split("\n").filter(element => !fileContent.includes(element)); //siehe ADD
                            changedContent = changedContent.map(element => [element, content.split("\n").indexOf(element)]); //siehe ADD
                            clients.forEach((client) => {
                                client.send(JSON.stringify({ successful: true, method: "CHA", data: changedContent })); //siehe ADD
                            });
                        }
                        if (clients.size > 0) {
                            console.log(`Updated all clients listening for ${file}`);
                        }
                        fileSize = content.split("\n").length; //speichere jetzigen stand
                        fileContent = content;
                    }
                });
            }

            let sendData = data.split("\n");
            if (sendData[sendData.length] == "") {
                sendData.slice(0, -1)
            }

            ws.send(JSON.stringify({ successful: true, method: "NEW", data: sendData })); //sende einmalig die vollständige datei an den client
        } else if (method === "UNS") { //Falls der client keine updates mehr über eine datei erhalten möchte
            clients.delete(ws); //Entferne client von der liste
            ws.send(JSON.stringify({ successful: true, data: "" }));
            //TODO: remove file from watchlist
        } else if (method === "ADD") {
            const [content, line] = data;
            orders.splice(line, 0, content);
            fs.writeFileSync(file, "");
            let writer = fs.createWriteStream(file, { flags: "a" });
            orders.forEach((element, index) => {
                if (index === 0) {
                    writer.write(element);
                } else {
                    writer.write("\n" + element);
                }
            });
            writer.close();
            ws.send(JSON.stringify({ successful: true, data: "" }));
        } else if (method === "CHA") {
            const [content, line] = data;
            orders[line] = content;
            fs.writeFileSync(file, "");
            let writer = fs.createWriteStream(file, { flags: "a" });
            orders.forEach((element, index) => {
                if (index === 0) {
                    writer.write(element);
                } else {
                    writer.write("\n" + element);
                }
            });
            writer.close();
            ws.send(JSON.stringify({ successful: true, data: "" }));
        } else if (method === "REM") {
            orders = orders.filter(element => !data.includes(element));
            fs.writeFileSync(file, "");
            let writer = fs.createWriteStream(file, { flags: "a" });
            orders.forEach((element, index) => {
                if (index === 0) {
                    writer.write(element);
                } else {
                    writer.write("\n" + element);
                }
            });
            writer.close();
            ws.send(JSON.stringify({ successful: true, data: "" }));
        } else {
            ws.send(JSON.stringify({ successful: false, data: "" }));
        }
        console.log(orders);
    });

    ws.on("close", () => {
        clients.delete(ws);
        console.log("Client disconnected");
    });
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

console.log("Websocket running on ws://localhost:8080");