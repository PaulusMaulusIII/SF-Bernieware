const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]'),
    root = document.querySelector(':root');

if (localStorage.getItem("darkMode") == null) {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        localStorage.setItem("darkMode", "on");
    } else {
        localStorage.setItem("darkMode", "on");
    }
}

let state = localStorage.getItem("darkMode");

if (state === "on") {
    root.style.setProperty('--darkGray', '#aaa');
    root.style.setProperty('--white', '#111');
    root.style.setProperty('--black', '#fff');
    root.style.setProperty('--lightGray', '#444');
    root.style.setProperty('--gray', 'rgb(128, 128, 128)');
    root.style.setProperty('--opaqueBlack', 'rgba(f, f, f, 0.7)');
    root.style.setProperty('--shadowLight', 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--shadow', 'rgba(6, 24, 44, 0.4)');
    root.style.setProperty('--shadowDark', 'rgba(6, 24, 44, 0.65)');
    toggleSwitch.click();
    document.getElementById("aboutUs").getElementsByClassName("icon")[0].src = "Medien/about_us_dark.svg";
    document.getElementById("search").getElementsByClassName("icon")[0].src = "Medien/Magnifying_glass_dark.svg";
    document.getElementById("cart").getElementsByClassName("icon")[0].src = "Medien/korb_dark.svg";
    try {
        Array.from(document.getElementsByClassName("item")).map(element => element.style.filter = "grayscale(1)");
    } catch (error) {
        
    }
}

const switchTheme = e => {
    if (e.target.checked) {
        localStorage.setItem("darkMode", "on");
        root.style.setProperty('--darkGray', '#aaa');
        root.style.setProperty('--white', '#111');
        root.style.setProperty('--black', '#fff');
        root.style.setProperty('--lightGray', '#444');
        root.style.setProperty('--gray', 'rgb(128, 128, 128)');
        root.style.setProperty('--opaqueBlack', 'rgba(f, f, f, 0.7)');
        root.style.setProperty('--shadowLight', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--shadow', 'rgba(255, 255, 255, 0.4)');
        root.style.setProperty('--shadowDark', 'rgba(255, 255, 255, 0.65)');
        document.getElementById("aboutUs").getElementsByClassName("icon")[0].src = "Medien/about_us_dark.svg";
        document.getElementById("search").getElementsByClassName("icon")[0].src = "Medien/Magnifying_glass_dark.svg";
        document.getElementById("cart").getElementsByClassName("icon")[0].src = "Medien/korb_dark.svg";
        try {
            Array.from(document.getElementsByClassName("item")).map(element => element.style.filter = "grayscale(1)");
        } catch (error) {
            
        }
    }
    else {
        localStorage.setItem("darkMode", "off");
        root.style.setProperty('--darkGray', '#444');
        root.style.setProperty('--white', '#fff');
        root.style.setProperty('--black', '#000');
        root.style.setProperty('--lightGray', '#aaa');
        root.style.setProperty('--gray', 'rgb(128, 128, 128)');
        root.style.setProperty('--opaqueBlack', 'rgba(0, 0, 0, 0.7)');
        root.style.setProperty('--shadowLight', 'rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--shadow', 'rgba(255, 255, 255, 0.4)');
        root.style.setProperty('--shadowDark', 'rgba(255, 255, 255, 0.65)');
        document.getElementById("aboutUs").getElementsByClassName("icon")[0].src = "Medien/about_us.svg";
        document.getElementById("search").getElementsByClassName("icon")[0].src = "Medien/Magnifying_glass.svg";
        document.getElementById("cart").getElementsByClassName("icon")[0].src = "Medien/korb.svg";
        try {
            Array.from(document.getElementsByClassName("item")).map(element => element.style.filter = "grayscale(0)");
        } catch (error) {
            
        }
    }
}

toggleSwitch.addEventListener('change', switchTheme, false);
