var i = 1;
const ban = [26, 28, 29, 33, 37, 39, 42, 45, 46, 65, 66, 67, 68, 69, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 113, 115, 116, 117, 118, 119];

while (i < 140) {

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

        section.className = "product";
        img.className = "image";
        p.className = "product-info info";
        select.className = "size info";
        button.className = "to-cart info";

        try {
            img.src = "Medien/Kleidung/" + i + "_h.jpg";
        } catch (error) {

        }
        p.textContent = i;
        optionXS.textContent = "XS";
        optionS.textContent = "S";
        optionM.textContent = "M";
        optionL.textContent = "L";
        optionXL.textContent = "XL";
        optionXXL.textContent = "XXL";

        select.append(optionXS, optionS, optionM, optionL, optionXL, optionXXL);
        picture.append(img);
        section.append(picture, p, select, button);
        content.append(section);

        i++;
    }
}