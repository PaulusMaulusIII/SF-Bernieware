const openPopupButton = document.getElementById("search"),
    closePopupButton = document.getElementById("closePopup"),
    overlay = document.getElementById("overlay"),
    popup = document.getElementById("searchPopup"),
    enter = document.getElementById("eingabe"),
    searchbar = document.getElementById("searchbar"),
    autocompleteField = document.getElementById("autocomplete");

let results;
let sortedResults;

const searchCSV = {

    getCSV: async (search) => {
        results = new Map();
        sortedResults = [];
        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                console.log(response);
                for (const element of CSVParser.parse(response)) {
                    for (const el of element) {
                        if (el.toUpperCase().includes(search.toUpperCase()) && !results.has(el)) {
                            results.set(el, { CSV: element, matches: 1 });
                        } else if (el.toUpperCase().includes(search.toUpperCase()) && results.has(el)) {
                            results.set(el, { CSV: element, matches: results.get(el).matches++ });
                        }
                    }
                }
                results.forEach((element, key) => sortedResults.push({ key: key, element: element }));
                sortedResults.sort((a, b) => a.element.matches - b.element.matches);
                sortedResults = sortedResults.splice(0, 5);
            })
            .catch(err => console.log(err));
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