const ACTIVE_STATES = new Set([

    // North
    "rj",
    "up",
    "ut",
    "hp",
    "pb",
    "hr",

    // West
    "gj",
    "mh",
    "ga",

    // Central
    "mp",
    "ct",

    // East
    "wb",
    "od",
    "br",
    "jh",

    // South
    "kl",
    "tn",
    "ka",
    "ap",
    "tg",

    // Northeast
    "as",
    "ar",
    "ml",
    "mn",
    "mz",
    "nl",
    "tr",
    "sk",

    // Union Territories
    "an",
    "ch",
    "dn",
    "dd",
    "dl",
    "jk",
    "ld",
    "py"
]);
function scrollToMap() {
    const map = document.getElementById("mapWrap");

    if (map) {
        map.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
}

function openQuiz() {
    console.log("Quiz coming soon...");
}

function resetTrip() {
    document.querySelectorAll(".selected-path").forEach(path => {
        path.classList.remove("selected-path");
    });
}

function go(screen) {
    if (screen === "landing") {
        resetTrip();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function setupMap() {

    const map = document.querySelector(".india-svg");

    if (!map) {
        console.error("India map not found!");
        return;
    }

    const paths = map.querySelectorAll("path");

    console.log("Map found:", paths.length, "paths");

    paths.forEach(path => {

        const id = path.getAttribute("id");

        // Disable states that are not currently supported
        if (!ACTIVE_STATES.has(id)) {

            path.style.opacity = "0.3";
            path.style.pointerEvents = "none";

            return;
        }

        // Active state
        path.classList.add("active-path");
        path.style.opacity = "1";
        path.style.pointerEvents = "auto";

        const stateName =
            path.getAttribute("aria-label") ||
            id.toUpperCase();

        path.setAttribute("title", stateName);

        // Hover
        const tooltip = document.getElementById("stateTooltip");

        path.addEventListener("mouseenter", (event) => {
            path.classList.add("map-path-hover");

            tooltip.textContent = stateName;
            tooltip.style.display = "block";

            tooltip.style.left = `${event.clientX + 12}px`;
            tooltip.style.top = `${event.clientY + 12}px`;
        });

        path.addEventListener("mousemove", (event) => {
            tooltip.style.left = `${event.clientX + 12}px`;
            tooltip.style.top = `${event.clientY + 12}px`;
        });

        path.addEventListener("mouseleave", () => {
            path.classList.remove("map-path-hover");
            tooltip.style.display = "none";
        });


        const statePaths = document.querySelectorAll(".india-svg path");

        statePaths.forEach(path => {
            path.addEventListener("click", () => {

            });
        });
        // Click
        path.addEventListener("click", () => {

            // Remove previous selection
            map.querySelectorAll(".selected-path").forEach(selected => {
                selected.classList.remove("selected-path");
            });

            // Select clicked state
            path.classList.add("selected-path");

            const state = path.getAttribute("data-state-id");
            const stateName = path.getAttribute("aria-label");
            window.location.href = `pages/state.html?state=${encodeURIComponent(state)}&title=${encodeURIComponent(stateName)}`;
            console.log("Selected:", stateName);
        });
    });
}



async function testBackend() {

    const response = await fetch(
        "http://localhost:3000/api/test?name=Dileep"
    );

    const data = await response.json();

    console.log(data);
}

async function sendTestData() {

    const response = await fetch(
        "http://localhost:3000/api/test",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destinations: ["Munnar", "Kochi", "Wayanad"],
                days: 7
            })
        }
    );

    const data = await response.json();

    console.log(data);
}


testBackend();
sendTestData();



// Run after HTML is loaded
if (document.readyState === "loading") {

    document.addEventListener("DOMContentLoaded", setupMap);

} else {

    setupMap();

}