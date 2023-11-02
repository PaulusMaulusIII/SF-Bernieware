let orderPopup = document.getElementById("orderPopup"),
    orderButton = document.getElementById("buy"),
    closeOrderPopup = document.getElementById("closeOrderPopup"),
    items = document.getElementById("itemTable"),
    sum = document.getElementById("sum");

orderButton.addEventListener("click", () => {
    overlay.style.display = "block";
    orderPopup.style.display = "flex";
    cartPopup.style.display = "none";
    popup.style.display = "none";
    displayOrder();
});

closeOrderPopup.addEventListener("click", () => {
    overlay.style.display = "none";
    orderPopup.style.display = "none";
});

const displayOrder = () => {

    items.innerHTML = "<tr><th>Menge</th><th>ID</th><th>Produkttyp</th><th>Größe</th><th>Preis</th><th>Untersumme</th></tr>";

    let sumList = [];

    if (userCart.items.length > 0) {
        userCart.items.forEach(element => {
            let item = document.createElement("tr"),
                amount = document.createElement("td"),
                id = document.createElement("td"),
                type = document.createElement("td"),
                size = document.createElement("td"),
                price = document.createElement("td"),
                subsum = document.createElement("td");

            item.classList.add("orderItem");

            amount.textContent = "x" + element.amount;
            id.textContent = element.id;
            type.textContent = element.type;
            size.textContent = element.size;
            price.textContent = element.price;
            subsum.textContent = (parseInt(element.amount) * parseInt(element.price)) + "€";

            sumList.push(parseInt(element.amount) * parseInt(element.price));

            item.append(amount, id, type, size, price, subsum);
            items.append(item);
        });

        let sumAmount = 0;
        sum.innerHTML = "";

        sumList.forEach(element => {
            sumAmount += element;
        });

        let sumElement = document.createElement("span").textContent = "Summe: " + sumAmount + "€";

        sum.append(sumElement);
    }
}
const getID = async () => {
    if (!localStorage.getItem("id")) {
        console.log("Working");
        await fetch("http://localhost:8080/submit", {
            method: "GET"
        })
            .then(response => response.text())
            .then(response => JSON.parse(response))
            .then(response => localStorage.setItem("id", response.id));
    }
    return localStorage.getItem("id");
}

document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = "orders.list"
    const surname = document.getElementById('surname').value;
    const name = document.getElementById('name').value;
    const items = [1, 122, 13, 35];
    let id = await getID();

    console.log(id);

    // Send the data to the Node.js server
    fetch('http://localhost:8080/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: file, id: id, surname: surname, name: name, items: items })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.id === id) {
                alert(data.id + ' submitted successfully.');
            } else {
                alert('Failed to submit order.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

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

const modifiyFile = async (file = "", method = "", data = []) => {
    await sendRequest(file, "SUB");
};

ws.addEventListener("open", async () => {
    console.log("Connected to the WebSocket server");
    await modifiyFile("orders.list", "ADD", ["Test", 0]);
    await modifiyFile("orders.list", "CHA", ["Auch Test", 0]);
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
            orders = orders.filter((element) => !data.includes(element));
        } else if (method === "CHA") {
            data.forEach((element) => {
                orders[element[1]] = element[0];
            });
        } else {
            console.log("Request successful");
        }

        console.log(orders);
        document.getElementById("content").innerHTML = "";
        orders.forEach(element => {
            document.getElementById("content").innerHTML += element + "<br>";
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