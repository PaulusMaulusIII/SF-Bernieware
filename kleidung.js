let i = 1,
    genderSelect = document.getElementById("genderSelect"),
    colorSelect = document.getElementById("colorSelect"),
    typeSelect = document.getElementById("typeSelect"),
    filterList = [false, false, false],
    fileList = [],
    imgV = [],
    imgH = [];

const del = () => {

    let content = document.getElementById("content");

    for (let el of document.querySelectorAll('.product')) {
        content.removeChild(el);
    }
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

const gen = (element = []) => {

    let fileAttr = []
    filePath = element[9] + "/" + element[0];

    let content = document.getElementById("content"),
        section = document.createElement("section"),
        a = document.createElement("a"),
        picture = document.createElement("picture"),
        img = document.createElement("img"),
        p = document.createElement("p"),
        select = document.createElement("select"),
        optionSelect = document.createElement("option"),
        button = document.createElement("button");

    for (let e = 2; e <= 8; e++) {
        fileAttr.push(element[e]);
    }

    section.className = "product";
    img.className = "image";
    p.className = "product-info info";
    select.className = "size info";
    select.name = "size-selection";
    button.className = "to-cart info";
    button.textContent = fileAttr[6];

    a.href = "einzel-ansicht.html?id="+element[0];

    try {
        img.src = filePath + "_v.jpg";
        img.addEventListener("mouseenter", hover, false);
        img.addEventListener("mouseover", hover, false);
        img.addEventListener("mouseleave", exit, false);
    } catch (error) {
        console.error("Unknown");
    }
    p.textContent = element[10];

    for (let g = 0; g < fileAttr.length; g++) {
        section.classList.add(fileAttr[g]);
    }

    optionSelect.textContent = "Größe auswählen";
    let sizeString = "";

    sizeString = fileAttr[5];

    let sizes = sizeString.split("/"),
        options = [];

    for (let g = 0; g < sizes.length; g++) {
        let option = document.createElement("option")
        option.textContent = sizes[g];
        option.value = sizes[g];
        options.push(option);
    }

    select.append(optionSelect,);
    options.forEach(element => {
        select.append(element);
    });
    a.append(img);
    picture.append(a);
    section.append(picture, p, select, button);
    content.append(section);

    imgV.push("http://localhost/" + filePath + "_v.jpg");
    imgH.push("http://localhost/" + filePath + "_h.jpg");

}

let apply = async (filterBy = []) => {

    del();

    await getCSV();

    let content = document.getElementById("content");

    for (let i = 0; i < filterBy.length; i++) {
        let filter = "";

        if (i === 0) {
            filter = "gender";
        } else if (i === 1) {
            filter = "color";
        } else if (i === 2) {
            filter = "type";
        }

        let filterSelect = document.getElementById((filter + "Select"));

        if (filter === "gender") {

            if (filterSelect.value === "Alle") {

            } else if (filterSelect.value === "Herren") {

                for (const el of document.querySelectorAll(".Damen")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".Kinder")) {
                    content.removeChild(el);
                }
            } else if (filterSelect.value === "Damen") {
                for (const el of document.querySelectorAll(".Herren")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".Kinder")) {
                    content.removeChild(el);
                }
            } else if (filterSelect.value === "Kinder") {
                for (const el of document.querySelectorAll(".Herren")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".Damen")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".Unisex")) {
                    content.removeChild(el);
                }
            }
        } else if (filter === "color") {
            let colors = ["weiß", "hBraun", "braun", "rosa", "rot", "dunkelBlau", "schwarz"],
                Colors = ["Weiß", "Hellbraun", "Braun", "Rosa", "Rot", "Dunkelblau", "Schwarz"];

            if (filterSelect.value === "Alle") {

            } else {
                for (let e = 0; e < colors.length; e++) {
                    if (filterSelect.value === colors[e]) {
                        for (let j = 0; j < Colors.length; j++) {
                            for (const el of document.querySelectorAll("." + Colors[j])) {
                                if (j !== e) {
                                    content.removeChild(el);
                                }
                            }
                        }
                    }
                }
            }
        } else if (filter === "type") {
            if (filterSelect.value === "Alle") {

            } else if (filterSelect.value === "Hoodies") {
                for (const el of document.querySelectorAll(".Jacke")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".T-Shirt")) {
                    content.removeChild(el);
                }
            } else if (filterSelect.value === "Jacken") {
                for (const el of document.querySelectorAll(".Hoodie")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".T-Shirt")) {
                    content.removeChild(el);
                }
            } else if (filterSelect.value === "T-Shirts") {
                for (const el of document.querySelectorAll(".Hoodie")) {
                    content.removeChild(el);
                }
                for (const el of document.querySelectorAll(".Jacke")) {
                    content.removeChild(el);
                }
            }
        }
    }
}

let getCSV = async () => {
    await fetch("http://localhost/database.csv")
        .then(response => response.text())
        .then(async (response) => {
            for (const element of parseCSV(response)) {
                if (element[1] == "Kleidung") {
                    await gen(element);
                }
            }
        })
        .catch(err => console.log(err));

    try {
        document.getElementById("content").removeChild(document.getElementById("loading"));
    } catch (error) {

    }
}

let hover = (evt) => {
    let img = evt.target;
    if (imgV.includes(img.src)) {
        img.src = imgH[imgV.indexOf(img.src)];
    }
}

let exit = (evt) => {
    let img = evt.target
    if (imgH.includes(img.src)) {
        img.src = imgV[imgH.indexOf(img.src)];
    }
}

getCSV();

genderSelect.addEventListener("change", () => {
    apply(filterList);
});

colorSelect.addEventListener("change", () => {
    apply(filterList);
});

typeSelect.addEventListener("change", () => {
    apply(filterList);
});