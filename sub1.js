function useTemplate(i) {
    var myTemplate = document.getElementById('template'),
        normalContent = document.getElementById('content'),
        clonedTemplate = myTemplate.content.cloneNode(true);
    normalContent.appendChild(clonedTemplate);
}

document.getElementById("title").textContent = "Moinsen";

var counter = 0;

while (counter < 1000) {
    useTemplate(counter);
    counter++;
}
