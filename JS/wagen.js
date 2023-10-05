const CartButton = document.getElementById("cart"),
    toCartButtons = document.getElementsByClassName("toCart"),
    cartPopup = document.getElementById("cartPopup"),
    clearCartButton = document.getElementById("clearCartButton"),
    cartDisplay = document.getElementById("cartContentP");

let userCart = {
    items: []
};

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
};

const closePopup = () => {
    cartPopup.style.display = "none";
};

const addToCart = (id) => {
    userCart.items.push(id);
    console.log(userCart.items);
    saveCartToLocalStorage();
};

const clearCart = () => {
    userCart.items = [];
    localStorage.removeItem('userCart');
};

const displayCart = () => {
    cartDisplay.textContent = userCart.items;
};

CartButton.addEventListener("mouseenter", () => openPopup());
CartButton.addEventListener("mouseover", () => openPopup());
CartButton.addEventListener("mouseleave", () => closePopup());

if (clearCartButton) {
    clearCartButton.addEventListener("click", () => {
        clearCart();
        displayCart(); // Update the cart display after clearing the cart
    });
}

loadCartFromLocalStorage();