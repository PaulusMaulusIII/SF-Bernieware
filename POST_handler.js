const http = require("http");
const { WebSocketServer } = require("ws");
//TODO Implement EMAIL (SMTP)
const crypto = require('crypto');
const fs = require("fs");
const port = 8080;

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    } else if (req.method === "GET") {
        const expiry = new Date(Date.now() + 31557600000).toUTCString();
        res.setHeader("Expires", expiry);
        console.log(expiry);

        const file = "users.list";
        const id = crypto.randomUUID();
        fs.appendFile(file, id + "\n", (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, id: 0 }));
            } else {
                console.log(`ID "${id}" saved to ${file} and sent`);
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, id: id }));
            }
        });
    } else if (req.method === "POST" && req.url === "/submit") {
        let body = "";
        req.on("data", (data) => {
            body += data;
        });
        req.on("end", () => {
            const postData = JSON.parse(body);
            const { file, id, surname, name, course, email, items } = postData;

            fs.appendFile(file, id + "\t" + surname + "\t" + name + "\t" + course + "\t" + email + "\t" + items + "\n", (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: false, id: 0 }));
                } else {
                    console.log(`ID "${id}" saved to ${file}`);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({ success: true, id: id }));
                }
            });
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});

const wss = new WebSocketServer({ server });
let clients = new Set();
let watchlist = new Set();

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
        const messageObj = JSON.parse(message);

        console.log(`Received: ${message}`);

        const { file, method, data } = messageObj;
        let orders = fs.readFileSync(file, "utf8").split("\n");
        console.log(orders);

        if (method === "SUB") {
            clients.add(ws);
            const data = fs.readFileSync(file, "utf-8");

            if (!watchlist.has(file)) {
                watchlist.add(file);

                let fileContent = fs.readFileSync(file, "utf8");
                let fileSize = fileContent.split("\n").length;
                fs.watchFile(file, (curr, prev) => {
                    if (curr.mtime > prev.mtime) {
                        const content = fs.readFileSync(file, 'utf8');
                        let newFileSize = content.split("\n").length;

                        if (newFileSize > fileSize) {
                            fileContent = fileContent.split("\n");
                            let addedContent = content.split("\n").filter(element => !fileContent.includes(element));
                            addedContent = addedContent.map(element => [element, content.split("\n").indexOf(element)]);
                            clients.forEach((client) => {
                                client.send(JSON.stringify({ successful: true, method: "ADD", data: addedContent }));
                            });
                        } else if (newFileSize < fileSize) {
                            let newFileContent = content.split("\n");
                            let deletedContent = fileContent.split("\n").filter(element => !newFileContent.includes(element));
                            clients.forEach((client) => {
                                client.send(JSON.stringify({ successful: true, method: "REM", data: deletedContent }));
                            });
                        } else {
                            fileContent = fileContent.split("\n");
                            let changedContent = content.split("\n").filter(element => !fileContent.includes(element));
                            changedContent = changedContent.map(element => [element, content.split("\n").indexOf(element)]);
                            clients.forEach((client) => {
                                client.send(JSON.stringify({ successful: true, method: "CHA", data: changedContent }));
                            });
                        }
                        if (clients.size > 0) {
                            console.log(`Updated all clients listening for ${file}`);
                        }
                        fileSize = content.split("\n").length;
                        fileContent = content;
                    }
                });
            }

            let sendData = data.split("\n");
            if (sendData[sendData.length] == "") {
                sendData.slice(0, -1)
            }

            ws.send(JSON.stringify({ successful: true, method: "NEW", data: sendData }));
        } else if (method === "UNS") {
            clients.delete(ws);
            ws.send(JSON.stringify({ successful: true, data: "" }));
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