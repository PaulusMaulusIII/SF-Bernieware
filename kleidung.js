let xhr = new XMLHttpRequest();

let i = 1,
    genderSelect = document.getElementById("genderSelect"),
    colorSelect = document.getElementById("colorSelect"),
    typeSelect = document.getElementById("typeSelect"),
    filterList = [false, false, false];

const
    hoodies = [],
    tShirts = [],
    jacken = [],
    teddys = [],
    trinkFlaschen = [],
    turnbeutel = [],
    braun = [1, 9, 17],
    hellbraun = [5, 8],
    schwarz = [3, 6, 11, 14, 18, 30, 35, 40, 44, 48, 53, 54, 58, 59, 63, 72, 73, 75, 76, 80, 103, 104, 108, 110, 121, 127, 128, 134, 135],
    dunkelblau = [2, 4, 10, 13, 16, 31, 34, 38, 43, 47, 52, 61, 71, 78, 102, 105, 106, 111, 122, 125, 131, 132, 138],
    weiß = [7, 12, 15, 19, 22, 24, 25, 50, 56, 60, 62, 70, 74, 77, 79, 100, 107, 114, 123, 124, 130, 133, 137],
    rot = [20, 21, 23, 27, 51, 55, 57, 64, 101, 120, 126, 129, 136],
    rosa = [32, 36, 41, 49, 109, 112],
    ban = [26, 28, 29, 33, 37, 39, 42, 45, 46, 65, 66, 67, 68, 69, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 113, 115, 116, 117, 118, 119];

while (i < 139) {
    if (i < 28 || (29 < i && i < 50)) {
        hoodies.push(i);
    } else if ((49 < i && i < 65) || (69 < i && i < 81) || (99 < i && i < 115)) {
        tShirts.push(i);
    } else if (119 < i && i < 139) {
        jacken.push(i);
    } else if (89 < i && i < 94) {
        teddys.push(i);
    } else if (64 < i && i < 69) {
        trinkFlaschen.push(i);
    } else if (80 < i && i < 87) {
        turnbeutel.push(i);
    }
    i++;
}

const del = () => {

    let content = document.getElementById("content");

    for (let el of document.querySelectorAll('.product')) {
        content.removeChild(el);
    }

}

const getFilesInDirectory = async (directoryPath) => {
    try {
        const response = await fetch(directoryPath);

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

const gen = () => {

    let kategorie = "Kleidung",
        kleidung = ["Hoodie", "Jacke", "T-Shirt"],
        passform = ["Damen", "Herren", "Kinder", "Unisex"],
        farbe = ["Weiß", "Hellbraun", "Braun", "Rosa", "Rot", "Dunkelblau", "Schwarz"];

    console.log(getFilesInDirectory("http://localhost/"+kategorie+"/"+kleidung[0]+"/"+passform[3]+"/"+farbe[0]));

    i = 1;

    while (i < 139) {

        if (ban.includes(i)) {
            i++;
        } else {
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
            img.addEventListener("mouseover", hover());
            p.className = "product-info info";
            select.className = "size info";
            select.name = "size-selection";
            button.className = "to-cart info";
            button.textContent = "Warenkorb";

            try {
                img.src = "Medien/Kleidung/" + i + "_v.jpg";
            } catch (error) {

            }
            p.textContent = i;

            if (weiß.includes(i)) {
                section.classList.add("Weiß");
            } else if (rosa.includes(i)) {
                section.classList.add("Rosa");
            } else if (rot.includes(i)) {
                section.classList.add("Rot");
            } else if (hellbraun.includes(i)) {
                section.classList.add("Hellbraun");
            } else if (braun.includes(i)) {
                section.classList.add("Braun");
            } else if (dunkelblau.includes(i)) {
                section.classList.add("Dunkelblau");
            } else if (schwarz.includes(i)) {
                section.classList.add("Schwarz");
            }

            if (hoodies.includes(i)) {
                if (i < 28) {
                    section.classList.add("Hoodie");
                    section.classList.add("Unisex");
                    section.classList.add("35€");
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                } else {
                    section.classList.add("Hoodie");
                    section.classList.add("Kinder");
                    section.classList.add("35€");
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "134";
                    optionS.textContent = "146";
                    optionM.textContent = "152";
                    optionL.textContent = "164";
                    optionXL.hidden = true;
                    optionXXL.hidden = true;
                }
            } else if (tShirts.includes(i)) {
                if (i < 65) {
                    section.classList.add("T-Shirt");
                    section.classList.add("Herren");
                    section.classList.add("26€");
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                } else if ((69 < i) && (i < 81)) {
                    section.classList.add("T-Shirt");
                    section.classList.add("Kinder");
                    section.classList.add("23€");
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "146";
                    optionS.textContent = "152";
                    optionM.textContent = "158";
                    optionL.textContent = "164";
                    optionXL.hidden = true;
                    optionXXL.hidden = true;
                } else if (99 < i && i < 115) {
                    section.classList.add("T-Shirt");
                    section.classList.add("Damen");
                    section.classList.add("25€");
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                }
            } else if (jacken.includes(i)) {
                section.classList.add("Jacke");
                section.classList.add("Unisex");
                section.classList.add("35€");
                optionSelect.textContent = "Größe auswählen";
                optionXS.textContent = "XS";
                optionS.textContent = "S";
                optionM.textContent = "M";
                optionL.textContent = "L";
                optionXL.textContent = "XL";
                optionXXL.textContent = "XXL";
            } else if (teddys.includes(i)) {
                section.classList.add(["Teddy", "26€"]);
            } else if (trinkFlaschen.includes(i)) {
                section.classList.add(["Flasche", "18€"]);
            } else if (turnbeutel.includes(i)) {
                section.classList.add(["Turnbeutel", "14€"]);
            }

            select.append(optionSelect, optionXS, optionS, optionM, optionL, optionXL, optionXXL);
            picture.append(img);
            section.append(picture, p, select, button);
            content.append(section);

            i++;
        }
    }
}

let apply = (filterBy = []) => {

    del();

    gen();

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

        console.log(filter);

        let filterSelect = document.getElementById((filter + "Select"));

        if (filter === "gender") {
            console.log(filterSelect.value);
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

hover = () => {

}

gen();

genderSelect.addEventListener("change", () => {
    apply(filterList);
});

colorSelect.addEventListener("change", () => {
    apply(filterList);
});

typeSelect.addEventListener("change", () => {
    apply(filterList);
});