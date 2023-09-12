var i = 1;

while (i < 120) {
    var content = document.getElementById("content"),
        section = document.createElement("section"),
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
        img.src = "Medien/Kleidung/"+i+"_h.jpg";
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
    section.append(img, p, select, button);
    content.append(section);

    i++
}