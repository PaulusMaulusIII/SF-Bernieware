const products = document.querySelector(".products");

/* 
<a href="sub.html?category=Kleidung">

    <section id="item1" class="item">

        <picture>
            <img src="Medien/Kleidung.jpg" alt="" srcset="">
        </picture>
        <br>
        <p>
            Kleidung
        </p>

    </section>

</a> 
*/

const getCategories = async () => {
    let categories = [];
    let categoryImages = [];
    await fetch("http://localhost:8080/categories")
        .then(response => response.text())
        .then(response => JSON.parse(response).data.map(element => {
            categories.push(element.split(".")[0]);
            categoryImages.push("http://localhost:8080/Kategorien/"+element);
        }));

    categories.map((element, index) => {
        const a = document.createElement("a"),
            item = document.createElement("section"),
            picture = document.createElement("picture"),
            img = document.createElement("img"),
            br = document.createElement("br"),
            p = document.createElement("p");

        a.href = "sub.html?category="+element;
        item.classList.add("item");
        img.src = categoryImages[index];
        p.textContent = element;

        picture.append(img);
        item.append(picture,br,p);
        a.append(item);
        products.append(a);
    });
};

getCategories();