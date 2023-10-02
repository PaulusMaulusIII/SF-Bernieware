const getCSV = async () => {
    let arr,
        id;
    const urlParams = new URLSearchParams(window.location.search);

    id = urlParams.get("id");

    await fetch("http://localhost/database.csv")
        .then(response => response.text())
        .then(async (response) => {
            arr = (parseCSV(response));

            let interesting = arr.filter(function (value) { return value[0] == id; });

            await gen(interesting);
        })
        .catch(err => console.log(err));
}

const parseCSV = (str) => {
    const arr = [];
    let quote = false;

    for (let row = 0, col = 0, c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c + 1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') {
            arr[row][col] += cc; ++c; continue;
        }

        if (cc == '"') {
            quote = !quote; continue;
        }

        if (cc == ',' && !quote) {
            ++col; continue;
        }

        if (cc == '\r' && nc == '\n' && !quote) {
            ++row; col = 0; ++c; continue;
        }

        if (cc == '\n' && !quote) {
            ++row; col = 0; continue;
        }
        if (cc == '\r' && !quote) {
            ++row; col = 0; continue;
        }

        arr[row][col] += cc;
    }
    return arr;
}

const gen = async (element = []) => {
    element = element[0];
    let id = element[0],
        kategorie = element[1],
        artikel = element[2],
        passform = element[3],
        hFarbe = element[4],
        motiv = element[5],
        aFarbe = element[6],
        sizes = element[7],
        preis = element[8],
        filePath = element[9],
        desc = element[10],
        content = document.getElementsByTagName("p")[0];

    content.textContent = element;

}

getCSV();

const openPopupButton = document.getElementById("suchen"),
    closePopupButton = document.getElementById("closePopup"),
    overlay = document.getElementById("overlay"),
    popup = document.getElementById("popup"),
    enter = document.getElementById("eingabe");

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
    window.location.href = "http://localhost/results.html?search=" + document.getElementById("searchbar").value;
})