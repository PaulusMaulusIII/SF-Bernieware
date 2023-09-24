let i = 1,
    colorSelect = document.getElementById("colorSelect"),
    typeSelect = document.getElementById("typeSelect"),
    filterList = [false, false],
    kategorie = "Praktisches",
    praktisches = ["Flasche", "Turnbeutel"],
    farbe = ["Weiß", "Hellbraun", "Braun", "Rosa", "Rot", "Dunkelblau", "Schwarz"],
    fileList = [];

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

            try {
                img.src = filePath;
                img.alt = fileAttr;
            } catch (error) {

            }
            p.textContent = fileName;

            for (let g = 0; g < fileAttr.length; g++) {
                section.classList.add(fileAttr[g]);
            }

            select.append(optionSelect, optionXS, optionS, optionM, optionL, optionXL, optionXXL);
            picture.append(img);
            section.append(picture, p, select, button);
            content.append(section);
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
            filter = "color";
        } else if (i === 1) {
            filter = "type";
        }

        let filterSelect = document.getElementById((filter + "Select"));

        if (filter === "color") {
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

            } else if (filterSelect.value === "Flaschen") {
                for (const el of document.querySelectorAll(".Turnbeutel")) {
                    content.removeChild(el);
                }
            } else if (filterSelect.value === "Turnbeutel") {
                for (const el of document.querySelectorAll(".Flasche")) {
                    content.removeChild(el);
                }
            }
        }
    }
}

let createFileList = async () => {

    for (let j = 0; j < farbe.length; j++) {

        for (let i = 0; i < praktisches.length; i++) {
    
            let files = await getFilesInDirectory("http://localhost/Medien/" + kategorie + "/" + praktisches[i] + "/" + farbe[j]);
    
            for (let k = 0; k < files.length; k++) {
                fileList.push(files[k] + ":" + praktisches[i] + ":" + farbe[j] + "$$" + "http://localhost/Medien/" + kategorie + "/" + praktisches[i] + "/" + farbe[j] + "/" + files[k]);
            }
        }
    }
    
    fileList.sort();

    document.getElementById("loading").style.display = "none";

    gen();
}

createFileList();

colorSelect.addEventListener("change", () => {
    apply(filterList);
});

typeSelect.addEventListener("change", () => {
    apply(filterList);
});