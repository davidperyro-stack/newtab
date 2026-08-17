function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
        document.getElementById("clock").textContent = `${hours}:${minutes}`;

        let greeting = "Good morning!";

        if (now.getHours() >= 12) {
            greeting = "Good afternoon!"
        }

        if (now.getHours() >= 18) {
            greeting = "Good evening!"
        }

       if (now.getHours() >= 22) {
         greeting = "Get some rest!!";
        }


    document.getElementById("greeting").textContent = greeting;
}

updateClock();

setInterval(updateClock, 1000);