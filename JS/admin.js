const body = document.getElementById("orders"),
    ws = new WebSocket(settings.websocket);
let orders = [];

//TODO: Make script check if connection is availble periodically
//TODO: Switch handling from lines to IDs

class FileRequest {
    constructor(file, method, data) {
        this.file = file;
        this.method = method;
        this.data = data;
    }
}

const getPromise = () => {
    return new Promise((resolve) => {
        const listener = (event) => {
            const { successful } = JSON.parse(event.data);
            if (successful) {
                resolve();
            } else {
                console.error("Request failed");
            }
        };
        ws.addEventListener("message", listener);
    });
};

const sendRequest = async (file = "", method = "", data = []) => {
    const req = new FileRequest(file, method, data);

    ws.send(JSON.stringify(req));
    console.log(`Sent: ${JSON.stringify(req)}`);
    await getPromise();
};

const modifyFile = async (file = "", method = "", data = []) => {
    await sendRequest(file, "UNS");
    await sendRequest(file, method, data);
    await sendRequest(file, "SUB");
};

ws.addEventListener("open", async () => {
    console.log("Connected to the WebSocket server");
    await sendRequest("orders.tsv", "SUB");
});

ws.addEventListener("message", (event) => {
    const messageObj = JSON.parse(event.data);
    const { successful, method, data } = messageObj;

    if (successful) {
        console.log(`Received from server: \n${event.data}`);
        if (method === "NEW") {
            orders = data;
        } else if (method === "ADD") {
            data.forEach((element) => {
                orders.splice(orders.indexOf(orders.filter(element => element.split("\t") == element[0])), 0, element[1]);
            });
        } else if (method === "REM") {
            data.forEach(element => {
                orders = orders.filter(ele => ele.split("\t")[0] != element);
            });
        } else if (method === "CHA") {
            data.forEach((element) => {
                orders[orders.indexOf(orders.find(ele => ele.split("\t")[0] === element[0]))] = element[1];
            });
        } else {
            console.log("Request successful");
        }

        console.log(orders);

        body.innerHTML = "";

        orders.forEach(element => {

            if (element.split("\t").length === 6) {
                const [UUID, surname, name, year, email, cart] = element.split("\t");

                const h3 = document.createElement("h3"),
                    table = document.createElement("table"),
                    theadrow = document.createElement("tr");

                h3.innerHTML = `Bestellung ${UUID} von:${surname} ${name}, Klasse: ${year}, Email-Adresse: <a href="mailto:${email}">${email}</a>:`;
                body.append(h3);
                theadrow.innerHTML = "<th>MENGE</th><th>ART</th><th>GRÖßE</th><th>ID</th><th>PREIS</th>";
                table.append(theadrow);

                let cartItems = [];
                JSON.parse(cart).data.forEach(element => cartItems.push(element));
                cartItems.map(element => JSON.parse(element)).map(element => {
                    const tr = document.createElement("tr")
                    const { id, type, size, amount, price } = element;
                    [amount + " x", type, size, id, price].map(element => {
                        const td = document.createElement("td");
                        td.textContent = element;
                        tr.append(td);
                    });
                    table.append(tr);
                });

                body.append(table);
            }

        });
    } else {
        if (!successful) {
            console.error("Request failed");
        } else {
            console.error("Something went wrong");
        }
    }
});

ws.addEventListener("close", () => {
    console.log("Disconnected from the WebSocket server");
});