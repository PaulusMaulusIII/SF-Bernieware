let interesting,
    typeList = [],
    colorList = [],
    genderList = [];

const detailCSV = {
    parseCSV: (str) => {
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

    getCSV: async (id) => {
        let arr;

        await fetch("http://localhost/database.csv")
            .then(response => response.text())
            .then(async (response) => {
                arr = (detailCSV.parseCSV(response));

                interesting = arr.filter(function (value) { return value[0] == id; })[0];
            })
            .catch(err => console.log(err));
    },

    checkCSV: async (column, list = []) => {
        await fetch("http://localhost/database.csv") //Fetch zieht die tabelle als HTML
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

const detailGen = {
    gen: async () => {

        let img = document.querySelectorAll("main picture img")[0],
            title = document.querySelectorAll("main section h2")[0],
            subtitle = document.querySelectorAll("main section h3")[0],
            desc = document.querySelectorAll("main section p")[0],
            button = document.querySelectorAll("main section button")[0],
            sizeSelect = document.getElementById("sizes"),
            colorSelect = document.getElementById("colors"),
            typeSelect = document.getElementById("types"),
            genderSelect = document.getElementById("genders"),
            selects = [colorSelect, typeSelect, genderSelect];


        img.src = "http://localhost/" + interesting[9] + "/" + interesting[0] + "_v.jpg";
        title.textContent = interesting[2];
        subtitle.textContent = interesting[5];
        desc.textContent = interesting[10];
        button.addEventListener("click", () => {
            addToCart(interesting[0], sizeSelect.value);
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
            window.location = "http://localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(4, colorSelect.value, colorList);
        });

        typeSelect.addEventListener("change", async () => {
            window.location = "http://localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(2, typeSelect.value, typeList);
        });

        genderSelect.addEventListener("change", async () => {
            window.location = "http://localhost/detail-view.html?id=" + detailGen.getElementIDByAttr(3, genderSelect.value, genderList);
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