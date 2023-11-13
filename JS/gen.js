let fileList = [],  //Liste aller Produkte aus der CSV
    filteredFileList = [],
    imgV = [], //Liste aller Dateien _v.jpg 
    imgH = [], //Liste aller Dateien _h.jpg symmetrisch zu imgV
    filterSection = document.getElementById("filters"),
    typeSelect,
    genderSelect,
    colorSelect,
    motiveSelect;

const genCSV = {
    parseCSV: str => {
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
    },

    getCSV: async () => {
        let search,
            category;
        const urlParams = new URLSearchParams(window.location.search);

        try {
            search = urlParams.get("search");
        } catch (error) { }

        try {
            category = urlParams.get("category");
        } catch (error) { }

        await fetch("http://localhost:8080/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                console.log(response);
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
    },

    checkCSV: column => {
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
    },

    getMin: column => {
        let sortList = [];

        fileList.forEach(element => {
            sortList.push(parseInt(element[column]));
        });

        return sortList.sort((a, b) => a - b)[0];
    },

    getMax: column => {
        let sortList = [];

        fileList.forEach(element => {
            sortList.push(parseInt(element[column]));
        });

        return sortList.sort((a, b) => a - b).pop();
    }
}

const filter = {
    typeFilter: false,
    genderFilter: false,
    colorFilter: false,
    motiveFilter: false,
    priceFilter: false,

    init: () => {
        filter.typeFilter = genCSV.checkCSV(2);
        filter.genderFilter = genCSV.checkCSV(3);
        filter.colorFilter = genCSV.checkCSV(4);
        filter.motiveFilter = genCSV.checkCSV(5);
        filter.priceFilter = genCSV.checkCSV(8);

        filter.createFilters();
    },

    createFilters: () => {

        if (filter.typeFilter) {
            typeSelect = filter.createFilterElement("type", "Alle Arten", "select");
            filter.createOptions(typeSelect, 2);
            typeSelect.addEventListener("change", () => {
                gen.gen();
            });
        }

        if (filter.genderFilter) {
            genderSelect = filter.createFilterElement("gender", "Alle Passformen", "select");
            filter.createOptions(genderSelect, 3);
            genderSelect.addEventListener("change", () => {
                gen.gen();
            });
        }

        if (filter.colorFilter) {
            colorSelect = filter.createFilterElement("color", "Alle Farben", "select")
            filter.createOptions(colorSelect, 4);
            colorSelect.addEventListener("change", () => {
                gen.gen();
            });
        }

        if (filter.motiveFilter) {
            motiveSelect = filter.createFilterElement("motive", "Alle Motive", "select");
            filter.createOptions(motiveSelect, 5);
            motiveSelect.addEventListener("change", () => {
                gen.gen();
            });
        }

        if (filter.priceFilter) {
            filter.createFilterElement("price", "Alle Preise", "range");
            sliders.init();
        }
    },

    createFilterElement: (filterType, optContent, type) => {
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
    },

    createOptions: (filterSelect, column) => {
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
    },

    filter: () => {
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

const gen = {
    gen: () => {

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
                img.src = filePath + "_v.jpg"; //Standard bild = vorderseite (_v.jpg) //TODO: Modernere Kompressionen aviv, webm, etc.
                if (element[11] == "j") {
                    img.addEventListener("mouseenter", hover, false);
                    img.addEventListener("mouseover", hover, false);    //EventListener, damit Rückseite angezeigt wird wenn Nutzer über Bild hovert
                    img.addEventListener("mouseleave", exit, false);
                }
            } catch (error) {
                console.error("Unknown");
            }
            p.innerHTML = element[10]; //Beschreibung aus CSV

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

            imgV.push(filePath + "_v.jpg"); //Ergänzt Bilder von Vorder- und Rückseite in entsprechende Listen um zwischen den Beiden zu wechseln
            imgH.push(filePath + "_h.jpg");
        });

    },

    del: () => {

        let content = document.getElementById("content");

        for (let el of document.querySelectorAll('.product')) {
            content.removeChild(el);    //Löscht jedes Produkt
        }
    },
}

const sliders = {
    init: () => {
        let rangeMin = 1;
        const range = document.querySelector(".range-selected");
        const rangeInput = document.querySelectorAll(".range-input input");
        const root = document.querySelector(':root');

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
                    root.style.setProperty('--thumbInner1', "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[0].value + "</text></svg>\")");
                    root.style.setProperty('--thumbInner2', "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[1].value + "</text></svg>\")");
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
        root.style.setProperty('--thumbInner1', "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[0].value + "</text></svg>\")");
        root.style.setProperty('--thumbInner2', "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='50px' ><text x='2.5' y='10' fill='black' font='Arial' font-size='10'>" + rangeInput[1].value + "</text></svg>\")");
        range.style.left = ((minRange - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
        range.style.right = 100 - ((maxRange - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
    },

    getVals: () => {
        const rangeInput = document.querySelectorAll(".range-input input");
        return [rangeInput[0].value, rangeInput[1].value];
    }
}

const hover = evt => {
    let img = evt.target
    const src = img.src.split("/").filter((element, index) => index > img.src.split("/").length - 5 && index <= img.src.split("/").length).reduce((prev,curr) => prev + "/" + curr);
    if (imgV.includes(src)) {
        img.src = imgH[imgV.indexOf(src)];
    }
}

const exit = evt => {
    let img = evt.target
    const src = img.src.split("/").filter((element, index) => index > img.src.split("/").length - 5 && index <= img.src.split("/").length).reduce((prev,curr) => prev + "/" + curr);
    if (imgH.includes(src)) {
        img.src = imgV[imgH.indexOf(src)];
    }
}

window.onload = async () => {
    await genCSV.getCSV();
    filter.init();
    gen.gen();
}