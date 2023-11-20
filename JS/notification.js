class PopUpNotification {
    notification = document.getElementById("notification")
    icon = document.getElementById("notificationIcon")
    text = document.getElementById("notificationText")
    constructor(icon = "", text = "") {
        this.icon.innerHTML = icon;
        this.text.innerHTML = text;
    }

    display = (duration = 1000) => {
        this.notification.style.transform = "translate(-50%, 500%)";
        this.notification.style.transform = "translate(-50%, 150%)";
        setTimeout(() => {
            this.notification.style.transform = "translate(-50%, 500%)";
        }, duration);
    }
}