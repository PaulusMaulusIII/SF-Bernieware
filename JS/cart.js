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
    getCSV: async () => {
        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                for (const element of CSVParser.parse(response)) {
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
            new PopUpNotification("<span style ='color:green;font-weigth:bold;font-size:6vh;'>&#10003;</span>", "<h4>Artikel zum Warenkorb hinzugefügt!</h4>").display(1000);

            cart.saveToLocalStorage();
        } else {
            new PopUpNotification("<span style ='color:red;font-weigth:bold;font-size:10vh;'>&times;</span>", "<h4>Bitte eine Größe angeben!</h4>").display(3000);
        }
    },

    clear: () => {
        userCart.items = [];
        localStorage.removeItem('userCart');
        cartDisplay.innerHTML = "";
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
                    section.append(picture, amount, size, price, remove);
                } else {
                    size.textContent = "";
                    section.append(picture, amount, size, price, remove);
                }
                cartDisplay.appendChild(section);
            });

            cart.saveToLocalStorage();

            cartDisplay.insertAdjacentHTML("beforeend", "<button id = \"clearCartButton\" onclick = \"cart.clear();\">Warenkorb leeren</button>");
            document.getElementById("buy").style.display = "block";
        } else {
            cartDisplay.style.justifyContent = "center";
            cartDisplay.innerHTML = "<p id=\"cartEmpty\">Der Warenkorb ist leer</p>";
            document.getElementById("buy").style.display = "none";
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