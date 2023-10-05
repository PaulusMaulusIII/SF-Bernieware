const CartButton = document.getElementById("cart"),
    toCartButton = document.getElementsByClassName("toCart"),
    cartContents = [],
    cartPopup = document.getElementById("cartPopup");

const openPopup = () => {
    cartPopup.style.display = "flex";
};

const closePopup = () => {
    cartPopup.style.display = "flex";
};

const addToCart = (id) => {
    cartContents.push(id);
};

CartButton.addEventListener("mouseenter", () => openPopup());
CartButton.addEventListener("mouseover", () => openPopup());
CartButton.addEventListener("mouseleave", () => closePopup());