var i = 1,

    genderCheck = document.getElementById("genderCheck"),
    genderSelect = document.getElementById("genderSelect"),
    /*
    */
    typeCheck = document.getElementById("typeCheck"),
    typeSelect = document.getElementById("typeSelect"),
    filterList = [false, false, false];

const
    hoodies = [],
    tShirts = [],
    jacken = [],
    teddys = [],
    trinkFlaschen = [],
    turnbeutel = [],
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

var del = () => {

    var content = document.getElementById("content");

    for (let el of document.querySelectorAll('.product')) {
        content.removeChild(el);
    }

}

var gen = () => {

    i = 1;

    while (i < 139) {

        if (ban.includes(i)) {
            i++;
        }
        else {
            var content = document.getElementById("content"),
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

            img.className = "image";
            p.className = "product-info info";
            select.className = "size info";
            select.name = "size-selection";
            button.className = "to-cart info";
            button.textContent = "Warenkorb"

            try {
                img.src = "Medien/Kleidung/" + i + "_v.jpg";
            } catch (error) {

            }
            p.textContent = i;

            if (hoodies.includes(i)) {
                if (i < 28) {
                    section.className = "product Hoodie Unisex 35€";
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                } else {
                    section.className = "product Hoodie Kinder 35€";
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
                    section.className = "product T-Shirt Herren 26€";
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                } else if ((69 < i) && (i < 81)) {
                    section.className = "product T-Shirt Kinder 23€";
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "146";
                    optionS.textContent = "152";
                    optionM.textContent = "158";
                    optionL.textContent = "164";
                    optionXL.hidden = true;
                    optionXXL.hidden = true;
                } else if (99 < i && i < 115) {
                    section.className = "product T-Shirt Damen 25€";
                    optionSelect.textContent = "Größe auswählen";
                    optionXS.textContent = "XS";
                    optionS.textContent = "S";
                    optionM.textContent = "M";
                    optionL.textContent = "L";
                    optionXL.textContent = "XL";
                    optionXXL.textContent = "XXL";
                }
            } else if (jacken.includes(i)) {
                section.className = "product Jacke Unisex 35€";
                optionSelect.textContent = "Größe auswählen";
                optionXS.textContent = "XS";
                optionS.textContent = "S";
                optionM.textContent = "M";
                optionL.textContent = "L";
                optionXL.textContent = "XL";
                optionXXL.textContent = "XXL";
            } else if (teddys.includes(i)) {
                section.className = "product Teddy 26€";
            } else if (trinkFlaschen.includes(i)) {
                section.className = "product Flasche 18€";
            } else if (turnbeutel.includes(i)) {
                section.className = "product Turnbeutel 14€";
            }

            select.append(optionSelect, optionXS, optionS, optionM, optionL, optionXL, optionXXL);
            picture.append(img);
            section.append(picture, p, select, button);
            content.append(section);

            i++;
        }
    }
}

var apply = (filterBy = []) => {

    del();

    gen();

    var content = document.getElementById("content");

    for (let i = 0; i < filterBy.length; i++) {
        var filter = "";

        if (i === 0 && filterBy[i] === true) {
            filter = "gender";
        } else if (i === 1 && filterBy[i] === true) {
            //TODO
        } else if (i === 2 && filterBy[i] === true) {
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
        } else if (false) {
            //TODO
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

gen();

genderSelect.addEventListener("change", () => {
        filterList[0] = true;
        apply(filterList);
});

//TODO

typeSelect.addEventListener("change", () => {
        filterList[2] = true;
        apply(filterList);
});