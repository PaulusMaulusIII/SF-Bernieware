let interesting,
    filteredList = [];

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
                console.log(interesting);
            })
            .catch(err => console.log(err));
    },

    checkCSV: async (column) => {
        await fetch("http://localhost/database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                filteredList = [];

                for (const element of detailCSV.parseCSV(response)) {
                    let equal = false;
                    for (let i = 0; i < interesting.length; i++) {
                        if (i != column) {
                            if (element[i] === interesting[i]) {
                                equal = true;
                            }
                        } else if (i === column) {
                            continue;
                        } else {
                            equal = false;
                            break;
                        }
                    }

                    if ((equal && element[column] != interesting[column]) && ((!filteredList.includes(element[column]) && element[column] != "N/A"))) {
                        filteredList.push(element[column]);
                    }
                }
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
            genderSelect = document.getElementById("genders");


        img.src = "http://localhost/" + interesting[9] + "/" + interesting[0] + "_v.jpg";
        title.textContent = interesting[2];
        subtitle.textContent = interesting[5];
        desc.textContent = interesting[10];
        button.addEventListener("click", () => {
            addToCart(interesting[0]);
        });

        let sizes = "";
        sizes = interesting[7];

        sizes.split("/").forEach(element => {
            let option = document.createElement("option");

            option.value = element;
            option.textContent = element;

            sizeSelect.append(option);
        });

        detailGen.createOptions(4, colorSelect);
        detailGen.createOptions(2, typeSelect);
        detailGen.createOptions(3, genderSelect);

        colorSelect.addEventListener("change", () => {
            
        })
    },

    createOptions: async (column, select) => {
        await detailCSV.checkCSV(column);

        let option = document.createElement("option");
        option.value = interesting[column];
        option.textContent = interesting[column];

        select.append(option);

        filteredList.forEach(element => {
            option = document.createElement("option");

            option.value = element;
            option.textContent = element;

            select.append(option);
        });
    }
}

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    await detailCSV.getCSV(id);
    await detailGen.gen();
}