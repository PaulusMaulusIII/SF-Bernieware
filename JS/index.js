const openPopupButton = document.getElementById("suchen"),
    closePopupButton = document.getElementById("closePopup"),
    overlay = document.getElementById("overlay"),
    popup = document.getElementById("popup"),
    enter = document.getElementById("eingabe"),
    searchbar = document.getElementById("searchbar");

openPopupButton.addEventListener("click", () => {
    overlay.style.display = "block";
    popup.style.display = "flex";
});

closePopupButton.addEventListener("click", () => {
    overlay.style.display = "none";
    popup.style.display = "none";
});

overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    popup.style.display = "none";
});

enter.addEventListener("click", () => {
    window.location.href = "http://localhost/results.html?search="+document.getElementById("searchbar").value;
});

searchbar.addEventListener("keypress", (evt) => {
    if (evt.code === "Enter") {
        window.location.href = "http://localhost/results.html?search="+document.getElementById("searchbar").value;
    }
});