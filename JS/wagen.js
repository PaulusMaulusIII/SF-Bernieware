const CartButton = document.getElementById("cart"),
    cartPopup = document.getElementById("cartPopup"),
    clearCartButton = document.getElementById("clearCartButton"),
    cartDisplay = document.getElementById("cartContent"),
    closeButton = document.getElementById("closeCartPopup"),
    empty = document.getElementById("cartEmpty");

let cartList = [];

let userCart = {
    items: []
}

let count = {};

const saveCartToLocalStorage = () => {
    localStorage.setItem('userCart', JSON.stringify(userCart));
}

const loadCartFromLocalStorage = () => {
    let cartData = localStorage.getItem('userCart');
    if (cartData) {
        userCart = JSON.parse(cartData);
        displayCart();
    }
}

const openPopup = () => {
    cartPopup.style.display = "flex";
    displayCart();
}

const closePopup = () => {
    cartPopup.style.display = "none";
}

const addToCart = (id) => {
    userCart.items.push(id);
    if (!count[id]) {
        count[id] = 1;
    } else {
        count[id] += 1;
    }

    console.groupCollapsed("addToCart");
    console.table(userCart.items);
    console.groupEnd;

    saveCartToLocalStorage();
}

const clearCart = () => {
    userCart.items = [];
    cartList = [];
    count = {};
    localStorage.removeItem('userCart');
    displayCart();
}

const displayCart = async () => {
    cartList = [];
    await getCSVByID();

    cartDisplay.innerHTML = "";

    if (cartList.length > 0) {
        cartList.forEach(element => {
            let section = document.createElement("section"),
                picture = document.createElement("picture"),
                img = document.createElement("img"),
                price = document.createElement("span"),
                amount = document.createElement("input"),
                remove = document.createElement("span"),
                name = document.createElement("span"),
                id = document.createElement("input"),
                size = document.createElement("span");

            section.classList.add("cartItem");
            picture.classList.add("cartPicture");
            amount.type = "number";
            amount.value = count[element[0]];
            remove.classList.add("removeFromCart");
            name.textContent = element[2];
            remove.textContent = "\u00D7";
            remove.addEventListener("click", (evt) => {
                const input = evt.target,
                    parent = input.parentElement,
                    id = parent.querySelectorAll("input[type = hidden]")[0].value;

                userCart.items[userCart.items.indexOf(id)] = 0;
                count[id] = 0;

                console.groupCollapsed("removeFromCart");
                console.table(userCart.items);
                console.table(count);
                console.groupEnd;

                displayCart();
            });
            price.textContent = amount.value * parseInt(element[8]) + "€";
            id.type = "hidden";
            id.value = element[0];
            amount.addEventListener("change", (evt) => {
                const input = evt.target,
                    parent = input.parentElement,
                    id = parent.querySelectorAll("input[type = hidden]")[0].value;

                count[id] = parseInt(input.value);
                if (count[id] <= 0) {
                    parent.querySelectorAll(".removeFromCart")[0].click();
                }
                displayCart();

                console.groupCollapsed("changeAmountOfItems");
                console.table(count);
                console.groupEnd;
            });

            img.src = element[9] + "/" + element[0] + "_v.jpg";

            picture.append(img);
            section.append(picture, name, amount, size, price, remove, id);
            cartDisplay.appendChild(section);
        });
        cartDisplay.insertAdjacentHTML("beforeend", "<button id = \"clearCartButton\" onclick = \"clearCart();\">Warenkorb leeren</button>");
    } else {
        cartDisplay.innerHTML = "<p id=\"cartEmpty\">Der Warenkorb ist leer</p>";
    }
}

const getCSVByID = async () => {
    await fetch("http://localhost/database.csv") //Fetch zieht die tabelle als HTML
        .then(response => response.text()) //HTML zu String
        .then(async (response) => {
            let preCartList = [];

            for (const element of genCSV.parseCSV(response)) {
                if (userCart.items.includes(element[0])) {
                    if (!preCartList.includes(element)) {
                        preCartList.push(element);
                    }
                }
            }

            preCartList.forEach(element => {
                element.push(count[element[0]]);
                cartList.push(element);
            });
        })
        .catch(err => console.log(err));
}

CartButton.addEventListener("mouseover", () => openPopup());

cartPopup.addEventListener("mouseleave", () => closePopup());

CartButton.addEventListener("click", () => openPopup());

closeButton.addEventListener("click", () => closePopup());

loadCartFromLocalStorage();