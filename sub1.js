function useTemplate() {
    var myTemplate = document.getElementById('template'),
        normalContent = document.getElementById('content'),
        clonedTemplate = myTemplate.content.cloneNode(true);
    normalContent.appendChild(clonedTemplate);
}

var counter = 0;

while (counter < 100) {
    useTemplate();
    counter++;
}

if (document.getElementById("size").value === "S") {
    document.body.style.backgroundColor = red;
}