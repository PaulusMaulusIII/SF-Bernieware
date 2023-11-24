const openPopupButton = document.getElementById("search"),
    closePopupButton = document.getElementById("closePopup"),
    overlay = document.getElementById("overlay"),
    popup = document.getElementById("searchPopup"),
    enter = document.getElementById("eingabe"),
    searchbar = document.getElementById("searchbar"),
    autocompleteField = document.getElementById("autocomplete");

let results = new Map();

const searchCSV = {

    getCSV: async (search) => {
        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                console.log(response);
                for (const element of CSVParser.parse(response)) {
                    for (const el of element) {
                        if (el.toUpperCase().includes(search.toUpperCase()) && !results.has(el)) {
                            results.set(el, element);
                        }
                    }
                }
            })
            .catch(err => console.log(err));

        try {
            document.getElementById("content").removeChild(document.getElementById("loading")); // "Bitte warten ... wird entfernt, falls es noch da ist"
        } catch (error) {

        }
    },
}

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
    orderPopup.style.display = "none";
});

enter.addEventListener("click", () => {
    window.location.href = "sub.html?search=" + document.getElementById("searchbar").value;
});

searchbar.addEventListener("keypress", (evt) => {
    if (evt.code === "Enter") {
        window.location.href = "sub.html?search=" + document.getElementById("searchbar").value;
    }
});

searchbar.addEventListener("input", () => {

});