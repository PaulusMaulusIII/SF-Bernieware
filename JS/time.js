const getDate = async () => {
    return await fetch(settings.backend_ip + "orderDate").then(response => response.text());
}

const createCountdown = async () => {
    let end = new Date(await getDate());
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

        dateElement.innerHTML = `Nächste Bestellung in ${days} Tagen`;
    }

    timer = setInterval(showRemaining, 1000);
}

createCountdown();