class genSuper {
    fileList = [];  //Liste aller Produkte aus der CSV
    filteredFileList = [];
    imgV = []; //Liste aller Dateien _v.jpg 
    imgH = []; //Liste aller Dateien _h.jpg symmetrisch zu imgV
    filterSection = document.getElementById("filters");
    typeSelect;
    genderSelect;
    colorSelect;
    motiveSelect;

    init = async () => {
        await genCSV.getCSV();
        filter.init();
        gen.gen();
    }

    hover = (evt) => {
        let img = evt.target;
        if (imgV.includes(img.src)) {
            img.src = imgH[imgV.indexOf(img.src)];
        }
    }

    exit = (evt) => {
        let img = evt.target
        if (imgH.includes(img.src)) {
            img.src = imgV[imgH.indexOf(img.src)];
        }
    }
}

class genCSV extends genSuper {
    parseCSV = (str) => {
        const arr = []; //Zu füllendes Array
        let quote = false; //Boolean für "Quoted fields" (Falls ein Komma in CSV in einem Wert ist muss es in Anührungszeichen angegeben werden, dies soll auch der Parser erkennen können)

        for (let row = 0, col = 0, c = 0; c < str.length; c++) { //Läuft so lange bis Keine Inhalte in der CSV genfunden werden
            let cc = str[c], nc = str[c + 1]; //Aktuelles Zeichen = Zeichen an Stelle c in CSV tabelle, Nächstes Zeichen ist Zeichen nach Stelle c (c+1)
            arr[row] = arr[row] || []; //Reihe ist entweder so lang wie row oder 0
            arr[row][col] = arr[row][col] || ''; //Falls col > 1, 2d array, sonst array

            if (cc == '"' && quote && nc == '"') { //Falls cc = '"' UND quote = true UND nc = '"' (Damit Anführungszeichen gelesen werden können, müssen sie in Anführungszeichen gegeben werden [Bsp. " -> CSV -> """ -> Parser -> "])
                arr[row][col] += cc; ++c; continue; //Schreibe cc in das Array und mache weiter
            }

            if (cc == '"') { //Falls Anführungszeichen
                quote = !quote; continue; //Invertiere status für quoted fields
            }

            if (cc == ',' && !quote) { //Bei einem Komma, dass nicht in einem Quoted field ist
                ++col; continue; //Zur nächsten Spalte übergehen
            }

            if (cc == '\r' && nc == '\n' && !quote) {//Falls der aktuelle char 'return carriage' ist UND der nächste 'next line' ist
                ++row; col = 0; ++c; continue; //In die nächste reihe springen und einen char weiter springen
            }

            if (cc == '\n' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }
            if (cc == '\r' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }

            arr[row][col] += cc; //aktuelle char in das array hinzufügen
        }
        return arr; //array returnen
    }

    getCSV = async () => {
        let search,
            category;
        const urlParams = new URLSearchParams(window.location.search);

        try {
            search = urlParams.get("search");
        } catch (error) { }

        try {
            category = urlParams.get("category");
        } catch (error) { }

        await fetch("http=//localhost/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                if (search != null) {
                    for (const element of genCSV.parseCSV(response)) {
                        for (const el of element) {
                            if (el.includes(search) && !fileList.includes(element)) {
                                fileList.push(element);
                            }
                        }
                    }
                } else if (category != null) {
                    for (const element of genCSV.parseCSV(response)) {
                        if (element[1] === category) {
                            fileList.push(element);
                        }
                    }
                }
            })
            .catch(err => console.log(err));

        try {
            document.getElementById("content").removeChild(document.getElementById("loading")); // "Bitte warten ... wird entfernt, falls es noch da ist"
        } catch (error) {

        }
    }

    checkCSV = (column) => {
        let checkList = [];

        fileList.forEach(element => {
            if (element[column] != "N/A" && !checkList.includes(element[column])) {
                checkList.push(element[column]);
            }
        });

        let filled = false;

        if (checkList.length > 1) {
            filled = true;
        }

        return filled;
    }

    getMin = (column) => {
        let sortList = [];

        fileList.forEach(element => {
            sortList.push(parseInt(element[column]));
        });

        return sortList.sort((a, b) => a - b)[0];
    }

    getMax = (column) => {
        let sortList = [];

        fileList.forEach(element => {
            sortList.push(parseInt(element[column]));
        });

        return sortList.sort((a, b) => a - b).pop();
    }
}

class filter extends genSuper {
    typeFilter = false;
    genderFilter = false;
    colorFilter = false;
    motiveFilter = false;
    priceFilter = false;

    init = () => {
        filter.typeFilter = genCSV.checkCSV(2);
        filter.genderFilter = genCSV.checkCSV(3);
        filter.colorFilter = genCSV.checkCSV(4);
        filter.motiveFilter = genCSV.checkCSV(5);
        filter.priceFilter = genCSV.checkCSV(8);

        filter.createFilters();
    }

    createFilters = () => {

        if (filter.typeFilter) {
            filter.createTypeFilter();
        }

        if (filter.genderFilter) {
            filter.createGenderFilter();
        }

        if (filter.colorFilter) {
            filter.createColorFilter();
        }

        if (filter.motiveFilter) {
            filter.createMotiveFilter();
        }

        if (filter.priceFilter) {
            filter.createPriceFilter();
        }
    }

    createTypeFilter = () => {
        typeSelect = filter.createFilterElement("type", "Alle Arten", "select");
        filter.createOptions(typeSelect, 2);
        typeSelect.addEventListener("change", () => {
            gen.gen();
        });
    }

    createGenderFilter = () => {
        genderSelect = filter.createFilterElement("gender", "Alle Passformen", "select");
        filter.createOptions(genderSelect, 3);
        genderSelect.addEventListener("change", () => {
            gen.gen();
        });
    }

    createColorFilter = () => {
        colorSelect = filter.createFilterElement("color", "Alle Farben", "select")
        filter.createOptions(colorSelect, 4);
        colorSelect.addEventListener("change", () => {
            gen.gen();
        });
    }

    createMotiveFilter = () => {
        motiveSelect = filter.createFilterElement("motive", "Alle Motive", "select");
        filter.createOptions(motiveSelect, 5);
        motiveSelect.addEventListener("change", () => {
            gen.gen();
        })
    }

    createPriceFilter = () => {
        filter.createFilterElement("price", "Alle Preise", "range");
        sliders.init();
    }

    createFilterElement = (filterType, optContent, type) => {
        let fieldset = document.createElement("fieldset");
        fieldset.id = filterType;
        fieldset.classList.add("filter");

        if (type === "select") {
            let select = document.createElement("select"),
                option = document.createElement("option");

            select.id = filterType + "Select";

            option.value = "Alle";
            option.textContent = optContent;

            select.append(option);
            fieldset.append(select);
            filterSection.append(fieldset);

            return document.getElementById(filterType + "Select");
        } else if (type === "range") {
            let fieldset = document.createElement("fieldset"),
                rangeSlider = document.createElement("section"),
                rangeInput = document.createElement("section"),
                rangeSelected = document.createElement("span"),
                range1 = document.createElement("input"),
                range2 = document.createElement("input");

            fieldset.classList.add("range");

            rangeSlider.classList.add("range-slider");
            rangeSelected.classList.add("range-selected");

            rangeInput.classList.add("range-input");
            range1.classList.add("min");
            range2.classList.add("max");
            let ranges = [range1, range2];
            ranges.forEach(element => {
                element.type = "range";
                element.min = genCSV.getMin(8);
                element.max = genCSV.getMax(8);
                element.step = "1";
                element.classList.add("priceRange");
            });
            range1.value = genCSV.getMin(8);
            range2.value = genCSV.getMax(8);

            rangeSlider.append(rangeSelected);
            rangeInput.append(range1, range2);
            fieldset.append(rangeSlider, rangeInput);
            filterSection.append(fieldset);
        }
    }

    createOptions = (filterSelect, column) => {
        let options = [];

        fileList.forEach(element => {
            if ((!options.includes(element[column])) && element[column] != "N/A") {
                options.push(element[column]);
            }
        });

        options.forEach(element => {
            let option = document.createElement("option");

            option.value = element;
            option.textContent = element;

            filterSelect.append(option);
        });
    }

    filter = () => {
        let type = "Alle",
            gender = "Alle",
            color = "Alle",
            motive = "Alle",
            price = [0, 9999],

            typeList = [],
            genderList = [],
            colorList = [],
            motiveList = [],
            priceList = [];

        filteredFileList = [];

        if (filter.typeFilter) {
            type = typeSelect.value;
        }

        if (filter.genderFilter) {
            gender = genderSelect.value;
        }

        if (filter.colorFilter) {
            color = colorSelect.value;
        }

        if (filter.motiveFilter) {
            motive = motiveSelect.value;
        }

        if (filter.priceFilter) {
            price = sliders.getVals();
        }

        gen.del();

        fileList.forEach(element => {

            if (element[2] === type && type !== "Alle") {
                typeList.push(element);
            } else if (type === "Alle" || (!filter.typeFilter)) {
                typeList.push(element);
            }

            if (gender === "Herren" || gender === "Damen") {
                if ((element[3] === gender || element[3] === "Unisex") && gender != "Alle") {
                    genderList.push(element);
                } else if (gender == "Alle") {
                    genderList.push(element);
                }
            } else {
                if (element[3] === gender && gender != "Alle") {
                    genderList.push(element);
                } else if (gender == "Alle") {
                    genderList.push(element);
                }
            }

            if (element[4] === color && color != "Alle") {
                colorList.push(element);
            } else if (color == "Alle") {
                colorList.push(element);
            }

            if (element[5] === motive && motive != "Alle") {
                motiveList.push(element);
            } else if (motive == "Alle") {
                motiveList.push(element);
            }

            if ((parseInt(element[8]) >= price[0] && parseInt(element[8]) <= price[1])) {
                priceList.push(element);
            }


            if (typeList.includes(element) && genderList.includes(element) && colorList.includes(element) && motiveList.includes(element) && priceList.includes(element)) {
                filteredFileList.push(element);
            }
        });
    }
}

class gen extends genSuper {
    gen = () => {

        filter.filter();

        filteredFileList.forEach(element => {
            let fileAttr = [], //Attribute (Farbe,Größen,etc.)
                filePath = element[9] + "/" + element[0]; //Pfad = Pfad aus CSV + / + id (ohne datei-endung)

            let content = document.getElementById("content"), //Parent div die mit den Produkten gefüllt werden soll
                section = document.createElement("section"), //Parent div für die einzelnen Produkte
                a = document.createElement("a"),    //Link zu einzelansicht
                picture = document.createElement("picture"),    //Beinhaltet das Bild
                img = document.createElement("img"),    //Produktfoto
                p = document.createElement("p"),    //Produktbeschreibung
                select = document.createElement("select"),  //Größenauswahl
                optionSelect = document.createElement("option"),    //Platzhalter "Größe auswählen"
                button = document.createElement("button");  //Zum Warenkorb hinzufügen Knopf

            for (let e = 2; e <= 8; e++) {
                fileAttr.push(element[e]); //Spalte 2 bis 8 aus CSV sind Attribute
            }

            section.className = "product";
            img.className = "image";
            p.className = "product-info info";
            select.className = "size info";     //Einheitliche Klassen für styling
            select.name = "size-selection";
            button.className = "toCart info";
            button.id = element[0];
            button.addEventListener("click", () => cart.add(button.id, element[2], select.value, fileAttr[6]));
            button.textContent = fileAttr[6]; //fileAttr[6] = Preis aus CSV

            a.href = "detail-view.html?id=" + element[0]; //Anchor leitet zur Einzelansicht weiter mit Produkt id aus CSV als parameter

            try {
                img.src = filePath + "_v.jpg"; //Standard bild = vorderseite (_v.jpg) //TODO Modernere Kompressionen aviv, webm, etc.
                if (element[11] == "j") {
                    img.addEventListener("mouseenter", hover, false);
                    img.addEventListener("mouseover", hover, false);    //EventListener, damit Rückseite angezeigt wird wenn Nutzer über Bild hovert
                    img.addEventListener("mouseleave", exit, false);
                }
            } catch (error) {
                console.error("Unknown");
            }
            p.textContent = element[10]; //Beschreibung aus CSV

            for (let g = 0; g < fileAttr.length; g++) {
                section.classList.add(fileAttr[g]);     //Vergabe der Klassen nach Attributen aus CSV
            }

            if (element[7] != "N/A") {
                optionSelect.textContent = "Größe auswählen";

                let sizeString = ""; //Initialisiren, damit Datentyp String feststeht
                sizeString = fileAttr[5]; //fileAttr[5] = Größen optionen getrennt durch "/"
                let sizes = sizeString.split("/"), //füllt array sizes mit den möglichen Größen
                    options = []; //Initialisieren von options als array
                for (let g = 0; g < sizes.length; g++) { //Wird für die Zahl der Größen optionen ausgeführt
                    let option = document.createElement("option"); //Erstelle ein "option" Element
                    option.textContent = sizes[g]; //Setze Inhalt
                    option.value = sizes[g];    //und Value auf korrespondierende Größe
                    options.push(option);   //Ergänzt options um das Element
                    select.append(optionSelect,);
                    options.forEach(element => {
                        select.append(element);
                    });
                    section.append(select);
                }
            }

            a.append(img);
            picture.append(a);
            section.append(picture, p, button);
            content.append(section);

            /*
            Grundlegende DOM-Struktur
            
            body
            |_content
                |_section
                    |_anchor element
                        |_picture
                            |_img
                    |_p
                    |_select
                        |_optionSelect
                        |_...
                    |_button
            */

            imgV.push("http=//localhost/" + filePath + "_v.jpg"); //Ergänzt Bilder von Vorder- und Rückseite in entsprechende Listen um zwischen den Beiden zu wechseln
            imgH.push("http=//localhost/" + filePath + "_h.jpg");
        });

    }

    del = () => {

        let content = document.getElementById("content");

        for (let el of document.querySelectorAll('.product')) {
            content.removeChild(el);    //Löscht jedes Produkt
        }
    }
}

class sliders extends genSuper {
    init = () => {
        let rangeMin = 1;
        const range = document.querySelector(".range-selected");
        const rangeInput = document.querySelectorAll(".range-input input");
        const root = document.querySelector('=root');

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minRange = parseInt(rangeInput[0].value);
                let maxRange = parseInt(rangeInput[1].value);
                if (maxRange - minRange < rangeMin) {
                    if (e.target.className === "min") {
                        rangeInput[0].value = maxRange - rangeMin;
                    } else {
                        rangeInput[1].value = minRange + rangeMin;
                    }
                } else {
                    root.style.setProperty('--thumbInner1', "url(\"data=image/svg+xml;utf8,<svg xmlns='http=//www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[0].value + "</text></svg>\")");
                    root.style.setProperty('--thumbInner2', "url(\"data=image/svg+xml;utf8,<svg xmlns='http=//www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[1].value + "</text></svg>\")");
                    range.style.left = ((minRange - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
                    range.style.right = 100 - ((maxRange - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
                }
            });

            input.addEventListener("change", () => {
                gen.gen();
            });
        });

        let minRange = parseInt(rangeInput[0].value);
        let maxRange = parseInt(rangeInput[1].value);
        root.style.setProperty('--thumbInner1', "url(\"data=image/svg+xml;utf8,<svg xmlns='http=//www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[0].value + "</text></svg>\")");
        root.style.setProperty('--thumbInner2', "url(\"data=image/svg+xml;utf8,<svg xmlns='http=//www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[1].value + "</text></svg>\")");
        range.style.left = ((minRange - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
        range.style.right = 100 - ((maxRange - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
    }

    getVals = () => {
        const rangeInput = document.querySelectorAll(".range-input input");
        return [rangeInput[0].value, rangeInput[1].value];
    }
}

class detailView {
    interesting;
    typeList = [];
    colorList = [];
    genderList = [];

    init = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("id");
        await detailCSV.getCSV(id);
        await detailGen.gen();
    }
}

class detailCSV extends detailView {
    parseCSV = (str) => {
        const arr = []; //Zu füllendes Array
        let quote = false; //Boolean für "Quoted fields" (Falls ein Komma in CSV in einem Wert ist muss es in Anührungszeichen angegeben werden, dies soll auch der Parser erkennen können)

        for (let row = 0, col = 0, c = 0; c < str.length; c++) { //Läuft so lange bis Keine Inhalte in der CSV genfunden werden
            let cc = str[c], nc = str[c + 1]; //Aktuelles Zeichen = Zeichen an Stelle c in CSV tabelle, Nächstes Zeichen ist Zeichen nach Stelle c (c+1)
            arr[row] = arr[row] || []; //Reihe ist entweder so lang wie row oder 0
            arr[row][col] = arr[row][col] || ''; //Falls col > 1, 2d array, sonst array

            if (cc == '"' && quote && nc == '"') { //Falls cc = '"' UND quote = true UND nc = '"' (Damit Anführungszeichen gelesen werden können, müssen sie in Anführungszeichen gegeben werden [Bsp. " -> CSV -> """ -> Parser -> "])
                arr[row][col] += cc; ++c; continue; //Schreibe cc in das Array und mache weiter
            }

            if (cc == '"') { //Falls Anführungszeichen
                quote = !quote; continue; //Invertiere status für quoted fields
            }

            if (cc == ',' && !quote) { //Bei einem Komma, dass nicht in einem Quoted field ist
                ++col; continue; //Zur nächsten Spalte übergehen
            }

            if (cc == '\r' && nc == '\n' && !quote) {//Falls der aktuelle char 'return carriage' ist UND der nächste 'next line' ist
                ++row; col = 0; ++c; continue; //In die nächste reihe springen und einen char weiter springen
            }

            if (cc == '\n' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }
            if (cc == '\r' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }

            arr[row][col] += cc; //aktuelle char in das array hinzufügen
        }
        return arr; //array returnen
    }

    getCSV = async (id) => {
        let arr;

        await fetch("http=//localhost/database.csv")
            .then(response => response.text())
            .then(async (response) => {
                arr = (detailCSV.parseCSV(response));

                interesting = arr.filter(function (value) { return value[0] == id; })[0];
            })
            .catch(err => console.log(err));
    }

    checkCSV = async (column, list = []) => {
        await fetch("http=//localhost/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                list.length = 0;

                detailCSV.parseCSV(response).forEach(element => {
                    equal = true;
                    let banned = [6, 7, 8]

                    for (let i = 1; i < interesting.length; i++) {
                        if (i != column) {
                            if (element[i] !== interesting[i] && !banned.includes(i)) {
                                equal = false;
                            }
                        }
                    }

                    if (equal && (element[column] != interesting[column])) {
                        list.push(element);
                    }
                });
            })
            .catch(err => console.log(err));
    }
}

class detailGen extends detailView {
    gen = async () => {

        let img = document.querySelectorAll("main picture img")[0],
            title = document.querySelectorAll("main section h2")[0],
            subtitle = document.querySelectorAll("main section h3")[0],
            desc = document.querySelectorAll("main section p")[0],
            button = document.querySelectorAll("main section button")[0],
            sizeSelect = document.getElementById("sizes"),
            colorSelect = document.getElementById("colors"),
            typeSelect = document.getElementById("types"),
            genderSelect = document.getElementById("genders");


        img.src = "http=//localhost/" + interesting[9] + "/" + interesting[0] + "_v.jpg";
        title.textContent = interesting[2];
        subtitle.textContent = interesting[5];
        desc.textContent = interesting[10];
        button.addEventListener("click", () => {
            cart.add(interesting[0], interesting[2], sizeSelect.value, interesting[8]);
        });

        let sizes = "";
        sizes = interesting[7];

        if (sizes != "N/A") {
            sizes.split("/").forEach(element => {
                let option = document.createElement("option");

                option.value = element;
                option.textContent = element;

                sizeSelect.append(option);
            });
        } else {
            sizeSelect.style.display = "none";
        }


        detailGen.createOptions(4, colorSelect, colorList);
        detailGen.createOptions(2, typeSelect, typeList);
        detailGen.createOptions(3, genderSelect, genderList);

        colorSelect.addEventListener("change", async () => {
            window.location = "http=//localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(4, colorSelect.value, colorList);
        });

        typeSelect.addEventListener("change", async () => {
            window.location = "http=//localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(2, typeSelect.value, typeList);
        });

        genderSelect.addEventListener("change", async () => {
            window.location = "http=//localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(3, genderSelect.value, genderList);
        });
    }

    createOptions = async (column, select, list = []) => {

        await detailCSV.checkCSV(column, list);

        let option = document.createElement("option");
        option.value = interesting[column];
        option.textContent = interesting[column];

        select.append(option);

        list.forEach(element => {
            option = document.createElement("option");

            option.value = element[column];
            option.textContent = element[column];

            select.append(option);
        });

        let listContent = [];
        if (interesting[column] != "N/A") {
            listContent.push(interesting[column]);
        }
        list.forEach(element => {
            if (!listContent.includes(element[column]) && element[column] != "N/A") {
                listContent.push(element[column]);
            }
        });

        if (listContent.length < 1) {
            select.style.display = "none";
        }
    }

    getElementIDByAttr = (column, attr, list = []) => {
        let id = 0;
        list.forEach(element => {
            if (element[column] === attr) {
                id = element[0];
            }
        });
        return id;
    }
}

class cartSuper {
    cartButton = document.getElementById("cart");
    cartPopup = document.getElementById("cartPopup");
    clearCartButton = document.getElementById("clearCartButton");
    cartDisplay = document.getElementById("cartContent");
    closeButton = document.getElementById("closeCartPopup");
    empty = document.getElementById("cartEmpty");
    cartList = [];

    userCart = {
        items: []
    }

    init = () => {
        cartButton.addEventListener("mouseover", () => popupCart.open());

        cartPopup.addEventListener("mouseleave", () => popupCart.close());

        cartButton.addEventListener("click", () => popupCart.open());

        closeButton.addEventListener("click", () => popupCart.close());

        cart.loadFromLocalStorage();
    }
}

class cartItem {
    constructor(id, type, size, amount, price) {
        this.id = id;
        this.type = type;
        this.size = size;
        this.amount = amount;
        this.price = price;
    }
}

class cartCSV extends cartSuper {
    parseCSV = (str) => {
        const arr = []; //Zu füllendes Array
        let quote = false; //Boolean für "Quoted fields" (Falls ein Komma in CSV in einem Wert ist muss es in Anührungszeichen angegeben werden, dies soll auch der Parser erkennen können)

        for (let row = 0, col = 0, c = 0; c < str.length; c++) { //Läuft so lange bis Keine Inhalte in der CSV genfunden werden
            let cc = str[c], nc = str[c + 1]; //Aktuelles Zeichen = Zeichen an Stelle c in CSV tabelle, Nächstes Zeichen ist Zeichen nach Stelle c (c+1)
            arr[row] = arr[row] || []; //Reihe ist entweder so lang wie row oder 0
            arr[row][col] = arr[row][col] || ''; //Falls col > 1, 2d array, sonst array

            if (cc == '"' && quote && nc == '"') { //Falls cc = '"' UND quote = true UND nc = '"' (Damit Anführungszeichen gelesen werden können, müssen sie in Anführungszeichen gegeben werden [Bsp. " -> CSV -> """ -> Parser -> "])
                arr[row][col] += cc; ++c; continue; //Schreibe cc in das Array und mache weiter
            }

            if (cc == '"') { //Falls Anführungszeichen
                quote = !quote; continue; //Invertiere status für quoted fields
            }

            if (cc == ',' && !quote) { //Bei einem Komma, dass nicht in einem Quoted field ist
                ++col; continue; //Zur nächsten Spalte übergehen
            }

            if (cc == '\r' && nc == '\n' && !quote) {//Falls der aktuelle char 'return carriage' ist UND der nächste 'next line' ist
                ++row; col = 0; ++c; continue; //In die nächste reihe springen und einen char weiter springen
            }

            if (cc == '\n' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }
            if (cc == '\r' && !quote) {
                ++row; col = 0; continue; //nächste reihe
            }

            arr[row][col] += cc; //aktuelle char in das array hinzufügen
        }
        return arr; //array returnen
    }

    getCSV = async () => {
        await fetch("http=//localhost/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                for (const element of cartCSV.parseCSV(response)) {
                    cartList.push(element);
                }
            })
            .catch(err => console.log(err));
    }
}

class cart extends cartSuper {
    saveToLocalStorage = () => {
        localStorage.setItem('userCart', JSON.stringify(userCart));
    }

    loadFromLocalStorage = async () => {
        await cartCSV.getCSV();

        let cartData = localStorage.getItem('userCart');
        if (cartData) {
            userCart = JSON.parse(cartData);
            cart.display();
        }
    }

    add = (id, type, size, price) => {
        if (size !== "Größe auswählen") {
            let cartItems = [];

            userCart.items.forEach(element => {
                cartItems.push(element.id + "/" + element.size);
            });

            if (cartItems.includes(id + "/" + size)) {
                userCart.items[cartItems.indexOf(id + "/" + size)].amount++;
            } else {
                userCart.items.push(new cartItem(id, type, size, 1, price))
            }

            cart.saveToLocalStorage();
        } else {
            alert("Bitte geben Sie eine Größe an!");
        }
    }

    clear = () => {
        userCart.items = [];
        localStorage.removeItem('userCart');
        cart.display();
    }

    display = async () => {

        let userCartIDs = [],
            cartListIDs = [];

        userCart.items.forEach(element => {
            userCartIDs.push(element.id);
        });

        cartList.forEach(element => {
            cartListIDs.push(element[0]);
        });

        cartDisplay.innerHTML = "";

        if (userCart.items.length > 0) {
            cartDisplay.style.justifyContent = "flex-start";
            userCart.items.forEach(element => {
                const CSVElement = cartList[cartListIDs.indexOf(element.id)];

                let section = document.createElement("section"),
                    picture = document.createElement("picture"),
                    img = document.createElement("img"),
                    price = document.createElement("span"),
                    amount = document.createElement("fieldset"),
                    decrease = document.createElement("button"),
                    amountDisplay = document.createElement("span"),
                    increase = document.createElement("button"),
                    remove = document.createElement("span"),
                    name = document.createElement("span"),
                    size = document.createElement("span");


                decrease.classList.add("dec");
                decrease.addEventListener("click", (evt) => {
                    amountDisplay.textContent--;
                    element.amount--;
                    if (element.amount <= 0) {
                        evt.target.parentNode.parentNode.getElementsByClassName("removeFromCart")[0].click();
                    }
                    cart.display();
                });
                decrease.textContent = "-";
                amountDisplay.classList.add("amountDisplay");
                amountDisplay.textContent = element.amount;
                increase.classList.add("inc");
                increase.addEventListener("click", () => {
                    amountDisplay.textContent++;
                    element.amount++;
                    cart.display();
                });
                increase.textContent = "+";

                amount.append(decrease, amountDisplay, increase);

                section.classList.add("cartItem");
                picture.classList.add("cartPicture");
                remove.classList.add("removeFromCart");
                remove.id = element.id;
                name.textContent = CSVElement[2];
                remove.textContent = "\u00D7";
                remove.addEventListener("click", (evt) => {
                    const input = evt.target,
                        id = input.id;

                    userCart.items.splice(userCartIDs.indexOf(id), 1);

                    cart.display();
                    cart.saveToLocalStorage();
                });
                price.textContent = parseInt(amountDisplay.textContent) * parseInt(CSVElement[8]) + "€";

                img.src = CSVElement[9] + "/" + element.id + "_v.jpg";

                picture.append(img);
                if (element.size != "") {
                    size.textContent = element.size;
                    section.append(picture, name, amount, size, price, remove);
                } else {
                    section.append(picture, name, amount, price, remove);
                }
                cartDisplay.appendChild(section);
            });

            cart.saveToLocalStorage();

            cartDisplay.insertAdjacentHTML("beforeend", "<button id = \"clearCartButton\" onclick = \"cart.clearCart();\">Warenkorb leeren</button>");
        } else {
            cartDisplay.style.justifyContent = "center";
            cartDisplay.innerHTML = "<p id=\"cartEmpty\">Der Warenkorb ist leer</p>";
        }
    }
}

class popupCart extends cartSuper {
    open = () => {
        cartPopup.style.display = "flex";
        cart.display();
    }

    close = () => {
        cartPopup.style.display = "none";
    }
}

class order {
    orderPopup = document.getElementById("orderPopup");
    orderButton = document.getElementById("buy");
    closeOrderPopup = document.getElementById("closeOrderPopup");
    items = document.getElementById("itemTable");
    sum = document.getElementById("sum");

    init = () => {
        orderButton.addEventListener("click", () => {
            overlay.style.display = "block";
            orderPopup.style.display = "flex";
            cartPopup.style.display = "none";
            popup.style.display = "none";
            displayOrder();
        });

        closeOrderPopup.addEventListener("click", () => {
            overlay.style.display = "none";
            orderPopup.style.display = "none";
        });
    }

    displayOrder = () => {

        items.innerHTML = "<tr><th>Menge</th><th>ID</th><th>Produkttyp</th><th>Größe</th><th>Preis</th><th>Untersumme</th></tr>";

        let sumList = [];

        if (userCart.items.length > 0) {
            userCart.items.forEach(element => {
                let item = document.createElement("tr"),
                    amount = document.createElement("td"),
                    id = document.createElement("td"),
                    type = document.createElement("td"),
                    size = document.createElement("td"),
                    price = document.createElement("td"),
                    subsum = document.createElement("td");

                item.classList.add("orderItem");

                amount.textContent = "x" + element.amount;
                id.textContent = element.id;
                type.textContent = element.type;
                size.textContent = element.size;
                price.textContent = element.price;
                subsum.textContent = (parseInt(element.amount) * parseInt(element.price)) + "€";

                sumList.push(parseInt(element.price));

                item.append(amount, id, type, size, price, subsum);
                items.append(item);
            });

            let sumAmount = 0;

            sumList.forEach(element => {
                sumAmount += element;
            });

            let sumElement = document.createElement("span").textContent = "Summe: " + sumAmount + "€";

            sum.append(sumElement);
        }
    }
}

class search {
    openPopupButton = document.getElementById("suchen");
    closePopupButton = document.getElementById("closePopup");
    overlay = document.getElementById("overlay");
    popup = document.getElementById("searchPopup");
    enter = document.getElementById("eingabe");
    searchbar = document.getElementById("searchbar");

    init = () => {
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
            window.location.href = "http://localhost/sub.html?search=" + document.getElementById("searchbar").value;
        });

        searchbar.addEventListener("keypress", (evt) => {
            if (evt.code === "Enter") {
                window.location.href = "http://localhost/sub.html?search=" + document.getElementById("searchbar").value;
            }
        });
    }
}