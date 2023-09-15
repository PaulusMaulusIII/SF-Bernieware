var i = 1;
const
    hoodies = [],
    tShirts = [],
    jacken = [],
    teddys = [],
    trinkFlaschen = [],
    turnbeutel = [],
    ban = [26, 28, 29, 33, 37, 39, 42, 45, 46, 65, 66, 67, 68, 69, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 113, 115, 116, 117, 118, 119];

while (i < 139) {
    if (i < 28 || 29 < i < 50) {
        hoodies.push(i);
    } else if (49 < i < 65 || 69 < i < 81 || 99 < i < 115) {
        tShirts.push(i);
    } else if (119 < i < 139) {
        jacken.push(i);
    } else if (89 < i < 94) {
        teddys.push(i);
    } else if (64 < i < 69) {
        trinkFlaschen.push(i);
    } else if (80 < i < 87) {
        turnbeutel.push(i);
    }
    i++;
}

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
        button.className = "to-cart info";

        try {
            img.src = "Medien/Kleidung/" + i + "_h.jpg";
        } catch (error) {

        }
        p.textContent = i;

        if (hoodies.includes(i)) {
            if (i < 28) {
                section.className = "product Hoodie Unisex 35€";
                optionXS.textContent = "XS";
                optionS.textContent = "S";
                optionM.textContent = "M";
                optionL.textContent = "L";
                optionXL.textContent = "XL";
                optionXXL.textContent = "XXL";
            } else {
                section.className = "product Hoodie Kinder 35€";
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
                optionXS.textContent = "XS";
                optionS.textContent = "S";
                optionM.textContent = "M";
                optionL.textContent = "L";
                optionXL.textContent = "XL";
                optionXXL.textContent = "XXL";
            } else if (69 < i < 81) {
                section.className = "product T-Shirt Kinder 23€";
                optionXS.textContent = "146";
                optionS.textContent = "152";
                optionM.textContent = "158";
                optionL.textContent = "164";
                optionXL.hidden = true;
                optionXXL.hidden = true;
            } else if (99 < i < 115) {
                section.className = "product T-Shirt Damen 25€";
                optionXS.textContent = "XS";
                optionS.textContent = "S";
                optionM.textContent = "M";
                optionL.textContent = "L";
                optionXL.textContent = "XL";
                optionXXL.textContent = "XXL";
            }
        } else if (jacken.includes(i)) {
            section.className = "product Jacke Unisex 35€";
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

        select.append(optionXS, optionS, optionM, optionL, optionXL, optionXXL);
        picture.append(img);
        section.append(picture, p, select, button);
        content.append(section);

        i++;
    }
}

apply = (String) => {
    if (String === 'gender') {
        if (document.getElementById("genderSelect").value === "Herren") {
            for (let el of document.querySelectorAll('.Unisex')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Damen')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Kinder')) el.style.visibility = 'hidden';
        }
        if (document.getElementById("genderSelect").value === "Damen") {
            for (let el of document.querySelectorAll('.Unisex')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Herren')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Kinder')) el.style.visibility = 'hidden';
        }
        if (document.getElementById("genderSelect").value === "Kinder") {
            for (let el of document.querySelectorAll('.Unisex')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Herren')) el.style.visibility = 'hidden';
            for (let el of document.querySelectorAll('.Damen')) el.style.visibility = 'hidden';
        }
    } else if (String === 'color') {
        //TODO
    } else if (String === 'type') {

    }
}