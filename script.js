function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const timeStr = `${hours}:${minutes}`;

    const clockEl = document.getElementById("clock");
    if (clockEl.textContent !== timeStr) {
        clockEl.textContent = timeStr;
    }

    let greeting = "Good morning!";

    if (now.getHours() >= 12) {
        greeting = "Good afternoon!";
    }

    if (now.getHours() >= 18) {
        greeting = "Good evening!";
    }

    if (now.getHours() >= 22) {
        greeting = "Get some rest!!";
    }

    const greetingEl = document.getElementById("greeting");
    if (greetingEl.textContent !== greeting) {
        greetingEl.textContent = greeting;
    }
}

updateClock();
setInterval(updateClock, 1000);

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query === "") {
        return;
    }

    window.location.href =
        `https://www.google.com/search?q=${encodeURIComponent(query)}`;
});

document.addEventListener("keydown", function (event) {
    const isTypingElsewhere =
        document.activeElement.tagName === "INPUT" ||
        document.activeElement.tagName === "TEXTAREA";

    const isSlash = event.key === "/";
    const isCtrlK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

    if (isCtrlK || (isSlash && !isTypingElsewhere)) {
        event.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});

const quoteEl = document.getElementById("quote");
const newQuoteButton = document.getElementById("newQuoteButton");

function getQuote() {
    newQuoteButton.disabled = true;
    quoteEl.classList.add("loading");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    fetch("https://quoteslate.vercel.app/api/quotes/random", { signal: controller.signal })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            quoteEl.textContent = `"${data.quote}" — ${data.author}`;
        })
        .catch(error => {
            console.error("Quote API error:", error);
            quoteEl.textContent = "Small steps become big changes.";
        })
        .finally(() => {
            clearTimeout(timeout);
            newQuoteButton.disabled = false;
            quoteEl.classList.remove("loading");
        });
}

newQuoteButton.addEventListener("click", getQuote);

getQuote();

const defaultBookmarks = [
    { name: "Gmail", url: "https://mail.google.com" },
    { name: "GitHub", url: "https://github.com" },
    { name: "YouTube", url: "https://youtube.com" },
    { name: "Slack", url: "https://slack.com" },
];

function loadBookmarks() {
    const saved = localStorage.getItem("bookmarkLinks");
    return saved ? JSON.parse(saved) : defaultBookmarks;
}

function saveBookmarks() {
    localStorage.setItem("bookmarkLinks", JSON.stringify(bookmarkLinks));
}

let bookmarkLinks = loadBookmarks();

function renderBookmarks() {
    const container = document.getElementById("bookmarks");

    container.innerHTML = "";

    bookmarkLinks.forEach((link, index) => {
        const wrapper = document.createElement("div");
        wrapper.className = "bookmark-wrapper";

        const a = document.createElement("a");
        a.className = "bookmark";
        a.href = link.url;

        const domain = new URL(link.url).hostname;

        a.innerHTML = `
            <img src="https://www.google.com/s2/favicons?sz=64&domain=${domain}" alt="">
            <span>${link.name}</span>
        `;

        const deleteButton = document.createElement("button");
        deleteButton.className = "bookmark-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "×";
        deleteButton.setAttribute("aria-label", `Remove ${link.name}`);

        deleteButton.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            bookmarkLinks.splice(index, 1);
            saveBookmarks();
            renderBookmarks();
        });

        wrapper.appendChild(a);
        wrapper.appendChild(deleteButton);
        container.appendChild(wrapper);
    });
}

renderBookmarks();

const addBookmarkButton = document.getElementById("addBookmarkButton");

addBookmarkButton.addEventListener("click", function () {
    let url = prompt("Enter the site URL (e.g. https://example.com):");

    if (!url) {
        return;
    }

    url = url.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    let domain;
    try {
        domain = new URL(url).hostname;
    } catch (error) {
        alert("That doesn't look like a valid URL.");
        return;
    }

    const name = prompt("Enter a label for this bookmark:", domain) || domain;

    bookmarkLinks.push({ name, url });
    saveBookmarks();
    renderBookmarks();
});

const weatherCodeMap = {
    0: "Clear sky",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent showers",
    95: "Thunderstorm",
};

function renderWeather(tempC, code) {
    const weatherEl = document.getElementById("weather");
    const description = weatherCodeMap[code] || "Weather";
    weatherEl.textContent = `${Math.round(tempC)}°C, ${description}`;
}

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            renderWeather(data.current.temperature_2m, data.current.weather_code);
        })
        .catch(error => {
            console.error("Weather API error:", error);
        });
}

function initWeather() {
    if (!navigator.geolocation) {
        return;
    }

    navigator.geolocation.getCurrentPosition(
        position => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        error => {
            console.error("Geolocation error:", error);
        },
        { timeout: 8000 }
    );
}

initWeather();

const NASA_API_KEY = "GwKDdB55pP3SIHoTHFmabvecZPXiCzTOAU7IujTF"

function renderApod(data) {
    console.log("APOD data:", data);

    const card = document.getElementById("apodCard");
    const image = document.getElementById("apodImage");
    const video = document.getElementById("apodVideo");
    const title = document.getElementById("apodTitle");

    image.style.display = "none";
    video.style.display = "none";

    if (data.media_type === "image") {
        image.style.display = "block";
        image.src = data.url;
        image.alt = data.title;
    } else if (data.media_type === "video" && data.url.endsWith(".mp4")) {
        video.style.display = "block";
        video.src = data.url;
    } else if (data.media_type === "video") {
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Watch today's video →";
        link.style.color = "var(--primary)";

        title.after(link);
    }

    title.textContent = data.title;
    card.classList.add("visible");
}

function fetchApod() {
    const today = new Date().toISOString().slice(0, 10);
    const cached = localStorage.getItem("apodData");

    if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.date === today) {
            renderApod(parsed.data);
            return;
        }
    }

    fetch(`https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("apodData", JSON.stringify({ date: today, data }));
            renderApod(data);
        })
        .catch(error => {
            console.error("APOD API error:", error);
        });
}

fetchApod();

const focusToggle = document.getElementById("focusToggle");

function applyFocusMode(enabled) {
    document.body.classList.toggle("focus-mode", enabled);
    focusToggle.textContent = enabled ? "◑" : "◐";
}

const savedFocusMode = localStorage.getItem("focusMode") === "true";
applyFocusMode(savedFocusMode);

focusToggle.addEventListener("click", function () {
    const isEnabled = document.body.classList.contains("focus-mode");
    const newState = !isEnabled;

    applyFocusMode(newState);
    localStorage.setItem("focusMode", newState);
});
