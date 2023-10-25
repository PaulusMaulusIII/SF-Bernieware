const cartButton = document.getElementById("cart"),
    cartPopup = document.getElementById("cartPopup"),
    clearCartButton = document.getElementById("clearCartButton"),
    cartDisplay = document.getElementById("cartContent"),
    closeButton = document.getElementById("closeCartPopup"),
    empty = document.getElementById("cartEmpty");

let cartList = [];

let userCart = {
    items: []
}

class cartItem {
    constructor(id, type, size, amount, price) {
        this.id = id;
        this.type = type;
        this.size = size;
        this.amount = amount;
        this.price = price;
    }
}

const cartCSV = {
    parseCSV: (str) => {
        const arr = []; //Zu füllendes Array
        let quote = false; //Boolean für "Quoted fields" (Falls ein Komma in CSV in einem Wert ist muss es in Anührungszeichen angegeben werden, dies soll auch der Parser erkennen können)

        for (let row = 0, col = 0, c = 0; c < str.length; c++) { //Läuft so lange bis Keine Inhalte in der CSV genfunden werden
            let cc = str[c], nc = str[c + 1]; //Aktuelles Zeichen = Zeichen an Stelle c in CSV tabelle, Nächstes Zeichen ist Zeichen nach Stelle c (c+1)
            arr[row] = arr[row] || []; //Reihe ist entweder so lang wie row oder 0
            arr[row][col] = arr[row][col] || ''; //Falls col > 1, 2d array, sonst array

            if (cc == '"' && quote && nc == '"') { //Falls cc = '"' UND quote = true UND nc = '"' (Damit Anführungszeichen gelesen werden können, müssen sie in Anführungszeichen gegeben werden [Bsp. " -> CSV -> """ -> Parser -> "])
                arr[row][col] += cc; ++c; continue; //Schreibe cc in das Array und mache weiter
            }

            if (cc == '"') { //Falls Anführungszeichen
                quote = !quote; continue; //Invertiere status für quoted fields
            }

            if (cc == ',' && !quote) { //Bei einem Komma, dass nicht in einem Quoted field ist
                ++col; continue; //Zur nächsten Spalte übergehen
            }

            if (cc == '\r' && nc == '\n' && !quote) {//Falls der aktuelle char 'return carriage' ist UND der nächste 'next line' ist
                ++row; col = 0; ++c; continue; //In die nächste reihe springen und einen char weiter springen
            }

            if (cc == '\n' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }
            if (cc == '\r' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }

            arr[row][col] += cc; //aktuelle char in das array hinzufügen
        }
        return arr; //array returnen
    },

    getCSV: async () => {
        await fetch("http://localhost/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                for (const element of cartCSV.parseCSV(response)) {
                    cartList.push(element);
                }
            })
            .catch(err => console.log(err));
    }
}

const cart = {
    saveToLocalStorage: () => {
        localStorage.setItem('userCart', JSON.stringify(userCart));
    },

    loadFromLocalStorage: async () => {
        await cartCSV.getCSV();

        let cartData = localStorage.getItem('userCart');
        if (cartData) {
            userCart = JSON.parse(cartData);
            cart.display();
        }
    },

    add: (id, type, size, price) => {
        if (size !== "Größe auswählen") {
            let cartItems = [];

            userCart.items.forEach(element => {
                cartItems.push(element.id + "/" + element.size);
            });

            if (cartItems.includes(id + "/" + size)) {
                userCart.items[cartItems.indexOf(id + "/" + size)].amount++;
            } else {
                userCart.items.push(new cartItem(id, type, size, 1, price))
            }

            cart.saveToLocalStorage();
        } else {
            alert("Bitte geben Sie eine Größe an!");
        }
    },

    clear: () => {
        userCart.items = [];
        localStorage.removeItem('userCart');
        cart.display();
    },

    display: async () => {

        let userCartIDs = [],
            cartListIDs = [];

        userCart.items.forEach(element => {
            userCartIDs.push(element.id);
        });

        cartList.forEach(element => {
            cartListIDs.push(element[0]);
        });

        cartDisplay.innerHTML = "";

        if (userCart.items.length > 0) {
            cartDisplay.style.justifyContent = "flex-start";
            userCart.items.forEach(element => {
                const CSVElement = cartList[cartListIDs.indexOf(element.id)];

                let section = document.createElement("section"),
                    picture = document.createElement("picture"),
                    img = document.createElement("img"),
                    price = document.createElement("span"),
                    amount = document.createElement("fieldset"),
                    decrease = document.createElement("button"),
                    amountDisplay = document.createElement("span"),
                    increase = document.createElement("button"),
                    remove = document.createElement("span"),
                    name = document.createElement("span"),
                    size = document.createElement("span");


                decrease.classList.add("dec");
                decrease.addEventListener("click", (evt) => {
                    amountDisplay.textContent--;
                    element.amount--;
                    if (element.amount <= 0) {
                        evt.target.parentNode.parentNode.getElementsByClassName("removeFromCart")[0].click();
                    }
                    cart.display();
                });
                decrease.textContent = "-";
                amountDisplay.classList.add("amountDisplay");
                amountDisplay.textContent = element.amount;
                increase.classList.add("inc");
                increase.addEventListener("click", () => {
                    amountDisplay.textContent++;
                    element.amount++;
                    cart.display();
                });
                increase.textContent = "+";

                amount.append(decrease, amountDisplay, increase);

                section.classList.add("cartItem");
                picture.classList.add("cartPicture");
                remove.classList.add("removeFromCart");
                remove.id = element.id;
                name.textContent = CSVElement[2];
                remove.textContent = "\u00D7";
                remove.addEventListener("click", (evt) => {
                    const input = evt.target,
                        id = input.id;

                    userCart.items.splice(userCartIDs.indexOf(id), 1);

                    cart.display();
                    cart.saveToLocalStorage();
                });
                price.textContent = parseInt(amountDisplay.textContent) * parseInt(CSVElement[8]) + "€";

                img.src = CSVElement[9] + "/" + element.id + "_v.jpg";

                picture.append(img);
                if (element.size != "") {
                    size.textContent = element.size;
                    section.append(picture, name, amount, size, price, remove);
                } else {
                    section.append(picture, name, amount, price, remove);
                }
                cartDisplay.appendChild(section);
            });

            cart.saveToLocalStorage();

            cartDisplay.insertAdjacentHTML("beforeend", "<button id = \"clearCartButton\" onclick = \"cart.clearCart();\">Warenkorb leeren</button>");
        } else {
            cartDisplay.style.justifyContent = "center";
            cartDisplay.innerHTML = "<p id=\"cartEmpty\">Der Warenkorb ist leer</p>";
        }
    }
}

const popupCart = {
    open: () => {
        cartPopup.style.display = "flex";
        cart.display();
    },

    close: () => {
        cartPopup.style.display = "none";
    }
}

cartButton.addEventListener("mouseover", () => popupCart.open());

cartPopup.addEventListener("mouseleave", () => popupCart.close());

cartButton.addEventListener("click", () => popupCart.open());

closeButton.addEventListener("click", () => popupCart.close());

cart.loadFromLocalStorage();