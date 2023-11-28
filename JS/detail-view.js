let interesting,
    typeList = [],
    colorList = [],
    genderList = [],
    imgV = [],
    imgH = [];

const detailCSV = {
    getCSV: async id => {
        let arr;

        await fetch(settings.backend_ip + "database.csv")
            .then(response => response.text())
            .then(async (response) => {
                arr = (CSVParser.parse(response));

                interesting = arr.filter(function (value) { return value[0] == id; })[0];
            })
            .catch(err => console.log(err));
    },

    checkCSV: async (column, list = []) => {
        await fetch(settings.backend_ip + "database.csv") //Fetch zieht die tabelle als HTML
            .then(response => response.text()) //HTML zu String
            .then(async (response) => {
                list.length = 0;

                CSVParser.parse(response).forEach(element => {
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
                    element.style = "background-color: var(--white); color: var(--black); border: var(--black) solid 1px; border-radius: 5px; height: 5vh; width: calc(100% + 20%);";
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

                picture.style = "display:flex; flex-grow:0; align-items:center; width: 90%; align-self: center; justify-self: center;"

                picture.append(buttonBack, img, buttonForth);
            }
        } else {
            picture.append(img);
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
    img.src = interesting[9] + "/" + interesting[0] + "_h.jpg";
}

const exit = evt => {
    let img = evt.target
    img.src = interesting[9] + "/" + interesting[0] + "_v.jpg";
}