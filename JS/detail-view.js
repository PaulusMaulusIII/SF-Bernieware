let interesting,
    typeList = [],
    colorList = [],
    genderList = [],
    imgV = [],
    imgH = [];

const detailCSV = {
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

    getCSV: async id => {
        let arr;

        await fetch(settings.backend_ip + "database.csv")
            .then(response => response.text())
            .then(async (response) => {
                arr = (detailCSV.parseCSV(response));

                interesting = arr.filter(function (value) { return value[0] == id; })[0];
            })
            .catch(err => console.log(err));
    },

    checkCSV: async (column, list = []) => {
        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                list.length = 0;

                detailCSV.parseCSV(response).forEach(element => {
                    equal = true;
                    let banned = [6, 7, 8, 9, 10]

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

const detailGen = {
    gen: async () => {

        let picture = document.querySelector("main picture"),
            img = document.createElement("img"),
            title = document.querySelector("main section h2"),
            subtitle = document.querySelector("main section h3"),
            desc = document.querySelector("main section p"),
            button = document.querySelector("main section button"),
            sizeSelect = document.getElementById("sizes"),
            colorSelect = document.getElementById("colors"),
            typeSelect = document.getElementById("types"),
            genderSelect = document.getElementById("genders");


        img.src = interesting[9] + "/" + interesting[0] + "_v.jpg";
        title.textContent = interesting[2];
        subtitle.textContent = "Motiv: " + interesting[5];
        desc.innerHTML = interesting[10];
        button.addEventListener("click", () => {
            cart.add(interesting[0], interesting[2], sizeSelect.value, interesting[8]);
        });

        if (interesting[11] == "j") {
            if (window.matchMedia("(pointer:fine)").matches) {
                img.addEventListener("mouseenter", hover);
                img.addEventListener("mouseover", hover);
                img.addEventListener("mouseleave", exit);
                picture.append(img);
            } else {
                let buttonBack = document.createElement("button"),
                    buttonForth = document.createElement("button");

                buttonBack.innerHTML = "&lt;";
                buttonForth.innerHTML = "&gt;";

                [buttonBack, buttonForth].map(element => {
                    element.style = "background-color: var(--white); color: var(--black); border: var(--black) solid 1px; border-radius: 5px; height: 5vh; width: calc(100% + 10%);";
                    element.addEventListener("click", () => {
                        const src = img.src.replace(window.location.origin, "");
                        if (img.src.endsWith("_h.jpg")) {
                            img.src = interesting[9] + "/" + interesting[0] + "_v.jpg";
                        } else {
                            img.src = interesting[9] + "/" + interesting[0] + "_h.jpg";
                        }
                        console.log(img.src);
                    });
                });

                picture.style = "display:flex; flex-grow:0; align-items:center;"

                picture.append(buttonBack, img, buttonForth);
            }
        }

        let sizes = "";
        sizes = interesting[7];

        if (sizes != "N/A") {
            let option = document.createElement("option");

            option.value = "Größe auswählen";
            option.textContent = "Größe auswählen";

            sizeSelect.append(option);

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
            window.location = "detail-view.html?id=" + detailGen.getElementIDByAttr(4, colorSelect.value, colorList);
        });

        typeSelect.addEventListener("change", async () => {
            window.location = "detail-view.html?id=" + detailGen.getElementIDByAttr(2, typeSelect.value, typeList);
        });

        genderSelect.addEventListener("change", async () => {
            window.location = "detail-view.html?id=" + detailGen.getElementIDByAttr(3, genderSelect.value, genderList);
        });
    },

    createOptions: async (column, select, list = []) => {

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
    },

    getElementIDByAttr: (column, attr, list = []) => {
        let id = 0;
        list.forEach(element => {
            if (element[column] === attr) {
                id = element[0];
            }
        });
        return id;
    }
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    await detailCSV.getCSV(id);
    await detailGen.gen();
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