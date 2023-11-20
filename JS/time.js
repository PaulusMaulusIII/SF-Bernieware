const getDate = async () => {
    return await fetch(settings.backend_ip + "orderDate").then(respone => respone.text());
}

let end = new Date(getDate());
console.log(end);
end = end.getTime();
console.log(end);
const dateElement = document.getElementById("date");

const _second = 1000;
const _minute = _second * 60;
const _hour = _minute * 60;
const _day = _hour * 24;
let timer;

function showRemaining() {
    const now = new Date();
    const distance = end - now;
    if (distance < 0) {

        clearInterval(timer);
        dateElement.innerHTML = 'Abgelaufen!';

        return;
    }
    const days = Math.floor(distance / _day);
    const hours = Math.floor((distance % _day) / _hour);
    const minutes = Math.floor((distance % _hour) / _minute);
    const seconds = Math.floor((distance % _minute) / _second);

    dateElement.innerHTML = `Nur noch ${days} Tage, ${hours} Std., ${minutes} Min. und ${seconds} Sek. bis zur nächsten Bestellung!`;
}

timer = setInterval(showRemaining, 1000);