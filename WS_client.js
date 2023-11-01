const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:8080");
let orders = [];

class FileRequest {
    constructor(file, method, data) {
        this.file = file;
        this.method = method;
        this.data = data;
    }
}

const getPromise = () => {
    return new Promise((resolve) => {
        const listener = (message) => {
            const {successful, } = JSON.parse(message);
            if (successful) {
                resolve();
            } else {
                console.error("Request failed");
            }
        }
        ws.once("message", listener);
    });
}

const sendRequest = async (file = "", method = "", data = []) => {
    const req = new FileRequest(file, method, data);

    ws.send(JSON.stringify(req));
    console.log(`Sent: ${JSON.stringify(req)}`);
    await getPromise("message");
}

ws.on("open", async () => {
    console.log("Connected to the WebSocket server");
    await sendRequest("names.txt", "UNS");
    await sendRequest("names.txt", "ADD", ["Auch auch ein Test", 1]);
    await sendRequest("names.txt", "SUB");
});

ws.on("message", (message) => {
    const messageObj = JSON.parse(message);
    const { successful, method, data } = messageObj;

    if (successful) {
        console.log(`Received from server: \n${message}`);
        if (method === "NEW") {
            orders = data
        } else if (method === "ADD") {
            data.forEach(element => {
                orders.splice(element[1], 0, element[0]);
            });
        } else if (method === "REM") {
            orders = orders.filter(element => !data.includes(element));
        } else if (method === "CHA") {
            data.forEach(element => {
                orders[element[1]] = element[0];
            });
        } else {
            console.log("Request successful")
        }

        console.log(orders);
    } else {
        if (!successful) {
            console.error("Request failed");
        } else {
            console.error("Something went wrong");
        }
    }
});

ws.on("close", () => {
    console.log("Disconnected from the WebSocket server");
});