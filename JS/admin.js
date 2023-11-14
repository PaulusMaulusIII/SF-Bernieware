const body = document.getElementById("orders"),
    ws = new WebSocket("ws://localhost:8080");
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
                orders.splice(element[1], 0, element[0]);
            });
        } else if (method === "REM") {
            data.forEach(element => {
                const [start, end] = element
                orders.splice(start, end);
            });
        } else if (method === "CHA") {
            data.forEach((element) => {
                orders[element[1]] = element[0];
            });
        } else {
            console.log("Request successful");
        }

        console.log(orders);

        body.innerHTML = "";

        let cartItems = [];
        orders.forEach(element => {

            if (element.split("\t").length === 6) {
                const [UUID, surname, name, year, email, cart] = element.split("\t");

                JSON.parse(cart).data.forEach(element => cartItems.push(element));
            }

        });

        let orderList = {
            products: [],
            buyers: [],
            orders: []
        };

        cartItems.map(element => JSON.parse(element)).map(element => {
            const { id, type, size, amount, price } = element;
            if (orderList.products.filter(element => element.split("/")[0] == id).length == 0) {
                orderList.products.push(`${id}/1`);
            } else {
                orderList.products.map((element,index) => {
                    if (element.split("/")[0] === id) {
                        console.log("Working", `${id}/${parseInt(element.split("/")[1]) + 1}`, orderList.products);
                        orderList.products[index] = `${id}/${parseInt(element.split("/")[1]) + 1}`
                    }
                });
            }
        });

        orderList.products.sort((a, b) => a.split("/")[1] - b.split("/")[1]);
        orderList.products.map(element => {
            const [id, amount] = element.split("/");
            let order = document.createElement("section");

            order.classList.add("order");
            order.id = id;
            order.innerHTML = `<h1>${id} &times ${amount}</h1>`;

            body.append(order);
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