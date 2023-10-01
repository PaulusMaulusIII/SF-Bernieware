let colorSelect = document.getElementById("colorSelect"),   //Filter (Geschlecht,Farbe,Passform)
    typeSelect = document.getElementById("typeSelect"),
    fileList = [],  //Liste aller Produkte aus der CSV
    filteredFileList = [],
    imgV = [], //Liste aller Dateien _v.jpg 
    imgH = []; //Liste aller Dateien _h.jpg symmetrisch zu imgV

const onLoad = async () => {
    await getCSV();
    createOptions();
    gen();
}

const createOptions = () => {
    let typeOptions = [],
        colorOptions = [];

    fileList.forEach(element => {
        if (!typeOptions.includes(element[2])) {
            typeOptions.push(element[2])
        }

        if (!colorOptions.includes(element[4])) {
            colorOptions.push(element[4])
        }
    });

    typeOptions.forEach(element => {
        let option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        typeSelect.append(option);
    });

    colorOptions.forEach(element => {
        let option = document.createElement("option");
        option.value = element;
        option.textContent = element;
        colorSelect.append(option);
    });
}

const parseCSV = (str /*CSV Tabelle*/) => {
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

const getCSV = async () => {
    await fetch("http://localhost/database.csv") //Fetch zieht die tabelle als HTML
        .then(response => response.text()) //HTML zu String
        .then(async (response) => {
            for (const element of parseCSV(response)) {
                if (element[1] == "Praktisches") { //Alle Kleidungsstücke werden in gen gegeben
                    fileList.push(element);
                }
            }
        })
        .catch(err => console.log(err));

    try {
        document.getElementById("content").removeChild(document.getElementById("loading")); // "Bitte warten ... wird entfernt, falls es noch da ist"
    } catch (error) {

    }
}

const filterFileList = () => {

    filteredFileList = [];

    del();

    let typeList = [],
        colorList = [],
        type = typeSelect.value,
        color = colorSelect.value;

    fileList.forEach(element => {
        if (element[2] === type && type != "Alle") {
            typeList.push(element);
        } else if (type == "Alle") {
            typeList.push(element);
        }

        if (element[4] === color && color != "Alle") {
            colorList.push(element);
        } else if (color == "Alle") {
            colorList.push(element);
        }

        if (typeList.includes(element) && colorList.includes(element)) {
            filteredFileList.push(element);
        }
    });

    console.log(filteredFileList);
}

const gen = () => {

    filterFileList();

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
        button.className = "to-cart info";
        button.textContent = fileAttr[6]; //fileAttr[6] = Preis aus CSV

        a.href = "einzel-ansicht.html?id=" + element[0]; //Anchor leitet zur Einzelansicht weiter mit Produkt id aus CSV als parameter

        try {
            img.src = filePath + "_v.jpg"; //Standard bild = vorderseite (_v.jpg) //TODO Modernere Kompressionen aviv, webm, etc.
            if (element[0] > 68) {
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

        imgV.push("http://localhost/" + filePath + "_v.jpg"); //Ergänzt Bilder von Vorder- und Rückseite in entsprechende Listen um zwischen den Beiden zu wechseln
        imgH.push("http://localhost/" + filePath + "_h.jpg");
    });

}

const del = () => {

    let content = document.getElementById("content");

    for (let el of document.querySelectorAll('.product')) {
        content.removeChild(el);    //Löscht jedes Produkt
    }
}

const hover = (evt) => {
    let img = evt.target;
    if (imgV.includes(img.src)) {
        img.src = imgH[imgV.indexOf(img.src)];
    }
}

const exit = (evt) => {
    let img = evt.target
    if (imgH.includes(img.src)) {
        img.src = imgV[imgH.indexOf(img.src)];
    }
}


onLoad();

colorSelect.addEventListener("change", () => gen());

typeSelect.addEventListener("change", () => gen());