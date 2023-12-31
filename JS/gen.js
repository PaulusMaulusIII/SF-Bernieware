let fileList = [],  //Liste aller Produkte aus der CSV
    filteredFileList = [],
    imgV = [], //Liste aller Dateien _v.jpg 
    imgH = [], //Liste aller Dateien _h.jpg symmetrisch zu imgV
    filterSection = document.getElementById("filters"),
    typeSelect,
    genderSelect,
    colorSelect,
    motiveSelect,
    mouseX,
    mouseY;

const genCSV = {
    getCSV: async () => {
        document.getElementById("filters").style.display = "none";
        Array.from(document.getElementsByTagName("hr")).map(element => element.style.display = "none");
        let search,
            category;
        const urlParams = new URLSearchParams(window.location.search);

        try {
            search = urlParams.get("search");
        } catch (error) { }

        try {
            category = urlParams.get("category");
        } catch (error) { }

        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                console.log(response);
                if (search != null) {
                    for (const element of CSVParser.parse(response)) {
                        for (const el of element) {
                            if (el.toUpperCase().includes(search.toUpperCase()) && !fileList.includes(element)) {
                                fileList.push(element);
                            }
                        }
                    }
                } else if (category != null) {
                    for (const element of CSVParser.parse(response)) {
                        if (element[1] === category) {
                            fileList.push(element);
                        }
                    }
                }
            })
            .catch(err => console.log(err));

        try {
            document.getElementById("content").removeChild(document.getElementById("loading")); // "Bitte warten ... wird entfernt, falls es noch da ist"
            document.getElementById("filters").style.display = "flex";
            Array.from(document.getElementsByTagName("hr")).map(element => element.style.display = "block");
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
                range2 = document.createElement("input"),
                label = document.createElement("label");

            fieldset.classList.add("range");

            rangeSlider.classList.add("range-slider");
            rangeSelected.classList.add("range-selected");

            label.id = "mobilePriceLabel"

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
            filterSection.append(label, fieldset);
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

        if (filteredFileList.length > 0) {
            filteredFileList.forEach(element => {
                let fileAttr = [], //Attribute (Farbe,Größen,etc.)
                    filePath = element[9] + "/" + element[0]; //Pfad = Pfad aus CSV + / + id (ohne datei-endung)

                let content = document.getElementById("content"), //Parent div die mit den Produkten gefüllt werden soll
                    section = document.createElement("section"), //Parent div für die einzelnen Produkte
                    a = document.createElement("a"),    //Link zu einzelansicht
                    picture = document.createElement("picture"),    //Beinhaltet das Bild
                    img = document.createElement("img"),    //Produktfoto
                    select = document.createElement("select"),  //Größenauswahl
                    optionSelect = document.createElement("option"),    //Platzhalter "Größe auswählen"
                    button = document.createElement("button");  //Zum Warenkorb hinzufügen Knopf

                for (let e = 2; e <= 8; e++) {
                    fileAttr.push(element[e]); //Spalte 2 bis 8 aus CSV sind Attribute
                }

                section.className = "product";
                img.className = "image";
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
                        if (window.matchMedia("(pointer:fine)").matches) {
                            img.addEventListener("mouseenter", hover);
                            img.addEventListener("mouseover", hover);
                            img.addEventListener("mouseleave", exit);
                            a.append(img);
                            picture.append(a);
                        } else {
                            let buttonBack = document.createElement("button"),
                                buttonForth = document.createElement("button");

                            buttonBack.innerHTML = "&lt;";
                            buttonForth.innerHTML = "&gt;";

                            [buttonBack, buttonForth].map(element => {
                                element.style = "background-color: var(--white); color: var(--black); border: var(--black) solid 1px; border-radius: 5px; height: 5vh; width: 20vw;";
                                element.addEventListener("click", () => {
                                    const src = img.src.replace(window.location.origin, "");
                                    if (img.src.endsWith("_h.jpg")) {
                                        if (imgH.includes(src)) {
                                            img.src = imgV[imgH.indexOf(src)];
                                        }
                                    } else {
                                        if (imgV.includes(src)) {
                                            img.src = imgH[imgV.indexOf(src)];
                                        }
                                    }
                                });
                            });

                            picture.style = "display:flex; flex-grow:0; align-items:center;"

                            a.append(img)
                            picture.append(buttonBack, a, buttonForth);
                        }
                    } else {
                        a.append(img);
                        picture.append(a);
                    }
                } catch (error) {
                    console.error("Event error, could not assign listeners to img element");
                }

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

                section.append(picture, button);
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

                imgV.push("/" + filePath + "_v.jpg"); //Ergänzt Bilder von Vorder- und Rückseite in entsprechende Listen um zwischen den Beiden zu wechseln
                imgH.push("/" + filePath + "_h.jpg");
            });
        } else {
            document.getElementById("content").innerHTML = "<h2>Keine Übereinstimmung gefunden!</h2>";
            if (fileList.length == 0) {
                document.getElementById("filters").style.display = "none";
                Array.from(document.querySelectorAll("hr")).map(element => element.style.display = "none");
            }
        }

    },

    del: () => {
        let content = document.getElementById("content");
        content.innerHTML = "";
    },
}

const sliders = {
    init: () => {
        let rangeMin = 1;
        const range = document.querySelector(".range-selected");
        const rangeInput = document.querySelectorAll(".range-input input");
        const label = document.getElementById("priceLabel");
        const mobilePriceLabel = document.getElementById("mobilePriceLabel");

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minRange = parseInt(rangeInput[0].value);
                let maxRange = parseInt(rangeInput[1].value);
                if (maxRange - minRange < rangeMin) {
                    if (e.target.className.includes("min")) {
                        rangeInput[0].value = maxRange - rangeMin;
                    } else {
                        rangeInput[1].value = minRange + rangeMin;
                    }
                } else {
                    range.style.left = ((minRange - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 100 + "%";
                    range.style.right = 100 - ((maxRange - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 100 + "%";
                }
                mobilePriceLabel.textContent = rangeInput[0].value + "€ - " + rangeInput[1].value + "€";
                label.textContent = rangeInput[0].value + "€ - " + rangeInput[1].value + "€";
            });

            input.addEventListener("change", () => {
                gen.del();
                gen.gen();
            });

            mobilePriceLabel.textContent = rangeInput[0].value + "€ - " + rangeInput[1].value + "€";
            label.textContent = rangeInput[0].value + "€ - " + rangeInput[1].value + "€";
        });

        let minRange = parseInt(rangeInput[0].value);
        let maxRange = parseInt(rangeInput[1].value);
        range.style.left = ((minRange - rangeInput[0].min) / (rangeInput[0].max - rangeInput[0].min)) * 110 + "%";
        range.style.right = 100 - ((maxRange - rangeInput[1].min) / (rangeInput[1].max - rangeInput[1].min)) * 110 + "%";
    },

    getVals: () => {
        const rangeInput = document.querySelectorAll(".range-input input");
        return [rangeInput[0].value, rangeInput[1].value];
    }
}

const hover = evt => {
    let img = evt.target
    const src = img.src.replace(window.location.origin, "");
    if (imgV.includes(src)) {
        img.src = imgH[imgV.indexOf(src)];
    }
}

const exit = evt => {
    let img = evt.target
    const src = img.src.replace(window.location.origin, "");
    if (imgH.includes(src)) {
        img.src = imgV[imgH.indexOf(src)];
    }
}

window.onload = async () => {
    await genCSV.getCSV();
    filter.init();
    gen.gen();
}

addEventListener("mousemove", p => {
    const slider = document.querySelector(".range-slider");
    const label = document.getElementById("priceLabel");
    mouseX = p.pageX;
    mouseY = p.pageY;
    try {
        if ((mouseX > slider.getBoundingClientRect().left && mouseX < slider.getBoundingClientRect().right) && (mouseY > (slider.getBoundingClientRect().top - 10) && mouseY < (slider.getBoundingClientRect().bottom + 10))) {
            label.style.left = `calc(${mouseX}px - 5vw)`;
            label.style.top = `calc(${document.querySelector(".range-slider").getBoundingClientRect().top + window.scrollY}px - 12vh)`
            label.style.display = "flex";
        } else {
            label.style.display = "none";
        }
    } catch (error) {

    }
})