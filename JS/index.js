const products = document.querySelector(".products");

const getCategories = async () => {
    let categories = [];
    let categoryImages = [];
    await fetch(settings.backend_ip + "categories")
        .then(response => response.text())
        .then(response => JSON.parse(response).data.map(element => {
            categories.push(element.split(".")[0]);
            element = element.replaceAll("ä", "-ae-").replaceAll("ü", "-ue-").replaceAll("ö", "-oe-").replaceAll("ß", "-sz-");
            categoryImages.push(settings.backend_ip + "Kategorien/" + element);
        }));

    categories.map((element, index) => {
        const a = document.createElement("a"),
            item = document.createElement("section"),
            picture = document.createElement("picture"),
            img = document.createElement("img"),
            br = document.createElement("br"),
            p = document.createElement("p");

        a.href = "sub.html?category=" + element;
        item.classList.add("item");
        img.classList.add("categoryImg");
        img.src = categoryImages[index];
        p.textContent = element;

        picture.append(img);
        item.append(picture, br, p);
        a.append(item);
        products.append(a);
    });
};

getCategories();