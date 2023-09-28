let i = 1,
    genderSelect = document.getElementById("genderSelect"),
    colorSelect = document.getElementById("colorSelect"),
    typeSelect = document.getElementById("typeSelect"),
    filterList = [false, false, false],
    kategorie = "Kleidung",
    kleidung = ["Hoodie", "Jacke", "T-Shirt"],
    passform = ["Damen", "Herren", "Kinder", "Unisex"],
    farbe = ["Weiss", "Hellbraun", "Braun", "Rosa", "Rot", "Dunkelblau", "Schwarz"],
    fileList = [],
    imgV = [],
    imgH = [];

const del = () => {

    let content = document.getElementById("content");

    for (let el of document.querySelectorAll('.product')) {
        content.removeChild(el);
    }
}

const getFilesInDirectory = async (directoryPath) => {
    try {
        const response = await fetch(directoryPath, { mode: "same-origin" });

        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const files = Array.from(doc.querySelectorAll('a')).map((a) =>
                a.textContent.trim()
            );

            const filteredFiles = files.filter(
                (entry) => entry !== '../' && entry !== './' && !entry.endsWith('/') && (entry.endsWith('.svg') || entry.endsWith('.jpg') || entry.endsWith('.png'))
            );

            return filteredFiles;
        } else {
            console.error(
                'Error fetching directory:',
                response.status,
                response.statusText
            );
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

const gen = async () => {

    for (let i = 0; i < fileList.length; i++) {

        let file = fileList[i].split("$$"),
            fileFile = file[0],
            filePath = file[1],
            fileListSplit = fileFile.split(":"),
            fileName = fileListSplit[0],
            fileAttr = [];

        for (let e = 1; e < fileListSplit.length; e++) {
            fileAttr.push(fileListSplit[e]);
        }

        if (!fileName.endsWith("_h.jpg")) {

            let content = document.getElementById("content"),
                section = document.createElement("section"),
                a = document.createElement("a"),
                picture = document.createElement("picture"),
                img = document.createElement("img"),
                p = document.createElement("p"),
                select = document.createElement("select"),
                optionSelect = document.createElement("option"),
                optionXS = document.createElement("option"),
                optionS = document.createElement("option"),
                optionM = document.createElement("option"),
                optionL = document.createElement("option"),
                optionXL = document.createElement("option"),
                optionXXL = document.createElement("option"),
                button = document.createElement("button");

            section.className = "product";
            img.className = "image";
            p.className = "product-info info";
            select.className = "size info";
            select.name = "size-selection";
            button.className = "to-cart info";
            button.textContent = "Warenkorb";

            a.href = "einzel-ansicht.html"

            try {
                img.src = filePath;
                img.alt = fileAttr;
                img.addEventListener("mouseenter", hover, false);
                img.addEventListener("mouseover", hover, false);
                img.addEventListener("mouseleave", exit, false);
            } catch (error) {
                console.error("Unknown");
            }
            p.textContent = fileName + "\n" + fileAttr;

            for (let g = 0; g < fileAttr.length; g++) {
                section.classList.add(fileAttr[g]);
            }

            select.append(optionSelect, optionXS, optionS, optionM, optionL, optionXL, optionXXL);
            a.append(img);
            picture.append(a);
            section.append(picture, p, select, button);
            content.append(section);

            imgV.push(filePath);
        } else {
            imgH.push(filePath);
        }
    }
}

let apply = async (filterBy = []) => {

    del();

    await gen();

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

let createFileList = async () => {

    for (let j = 0; j < farbe.length; j++) {
        for (let e = 0; e < passform.length; e++) {
            for (let i = 0; i < kleidung.length; i++) {

                let files = await getFilesInDirectory("http://localhost/Medien/" + kategorie + "/" + kleidung[i] + "/" + passform[e] + "/" + farbe[j]);

                for (let k = 0; k < files.length; k++) {
                    fileList.push(files[k] + ":" + kleidung[i] + ":" + passform[e] + ":" + farbe[j] + "$$" + "http://localhost/Medien/" + kategorie + "/" + kleidung[i] + "/" + passform[e] + "/" + farbe[j] + "/" + files[k]);
                }
            }
        }
    }

    fileList.sort();

    document.getElementById("content").removeChild(document.getElementById("loading"));

    gen();
}

createFileList();

let hover = (evt) => {
    let img = evt.target
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

genderSelect.addEventListener("change", () => {
    apply(filterList);
});

colorSelect.addEventListener("change", () => {
    apply(filterList);
});

typeSelect.addEventListener("change", () => {
    apply(filterList);
});