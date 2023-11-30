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

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = "orders.tsv",
        surname = document.getElementById('surname').value,
        name = document.getElementById('name').value,
        course = document.getElementById('class').value,
        email = document.getElementById('email').value;

    let items = userCart.items.map(element => JSON.stringify(element));
    closeOrderPopup.click();

    // Send the data to the Node.js server
    fetch(settings.backend_ip + 'submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: file, surname: surname, name: name, course: course, email: email, items: JSON.stringify({ data: items }) })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                new PopUpNotification("<span style ='color:green;font-weigth:bold;font-size:3vh;'>&#10003;</span>", "<h4>Bestellung ist erfolgt!</h4>").display(3000);
            } else {
                new PopUpNotification("<span style ='color:red;font-weigth:bold;font-size:10vh;'>&times;</span>", "<h4>Bestellvorgang gescheitert!</h4>").display(10000);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});