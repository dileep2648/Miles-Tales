


// =========================
// GET SELECTED STATE
// =========================

const params = new URLSearchParams(window.location.search);

const selectedState = params.get("state");
const title = params.get("title");

const stateName = document.getElementById("stateName");

stateName.textContent = title || selectedState;


// =========================
// STATE INFORMATION
// =========================

const stateData = states[selectedState];

const stateTagline = document.getElementById("stateTagline");
stateTagline.textContent = stateData.tagline;

const stateDescription = document.getElementById("stateDescription");
stateDescription.textContent = stateData.description;

const stateRegionLabel = document.getElementById("stateRegionLabel");
stateRegionLabel.textContent = stateData.regionLabel;


// =========================
// STATE HERO IMAGE
// =========================

async function loadStateImage() {

    const query =
        `${title || selectedState} India tourism landscape landmarks travel photography`;

    const image = await getImage(query);

    const stateIntroImg =
        document.getElementById("stateHeroImage");

    stateIntroImg.src = image;
}

loadStateImage();


// =========================
// LOAD AI DESTINATIONS
// =========================

async function loadDestinations() {

    try {

        const response = await fetch(
            `http://localhost:3000/api/destinations?state=${encodeURIComponent(selectedState)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch destinations");
        }

        const data = await response.json();

        console.log("AI Destinations:", data);

        const aiDestinations =
            data.result.destinations;

        renderDestinations(aiDestinations);

    } catch (error) {

        console.error(
            "Error loading destinations:",
            error
        );

    }
}

loadDestinations();


// =========================
// PEXELS IMAGE SEARCH
// =========================

async function getImage(query) {

    const response = await fetch(
        `http://localhost:3000/api/image?query=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    return data.image || "";
}


// =========================
// DESTINATION CARDS
// =========================

async function renderDestinations(data) {

    destinationsGrid.innerHTML = "";


    // --------------------------------
    // LOAD ALL IMAGES IN PARALLEL
    // --------------------------------

    const images = await Promise.all(
        data.map(place =>
            getImage(place.imageQuery)
        )
    );


    // --------------------------------
    // CREATE CARDS
    // --------------------------------

    for (let i = 0; i < data.length; i++) {

        const place = data[i];
        const image = images[i];


        const card = document.createElement("div");

        card.className = "d-cards";


        // --------------------------------
        // CARD HTML
        // --------------------------------

        card.innerHTML = `
            <div class="img-card">
                <img 
                    src="${image}" 
                    alt="${place.name}"
                >
            </div>

            <div class="info">

                <div class="title">
                    ${place.name}
                </div>

                <div class="desc">
                    ${place.description}
                </div>

                <div class="rating">
                    ★ ${place.rating}
                </div>

                <button class="add-whiteboard-btn">
                    + Add to Whiteboard
                </button>

            </div>
        `;


        // --------------------------------
        // WHITEBOARD BUTTON
        // --------------------------------

        const cardButton =
            card.querySelector(
                ".add-whiteboard-btn"
            );

        cardButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                addToWhiteboard(place);

            }
        );


        // --------------------------------
        // EXPANDED CARD
        // --------------------------------

        card.addEventListener(
            "click",
            () => {

                const Excard =
                    document.createElement("div");

                Excard.innerHTML = `

    <!-- Close Button -->
    <button
        class="close-expanded"
        aria-label="Close"
    >
        ×
    </button>


    <!-- Destination Image -->
    <div class="expanded-image">

        <img
            src="${image}"
            alt="${place.name}"
        >

    </div>


    <!-- Destination Information -->
    <div class="expanded-content">


        <!-- Category + Title + Location -->
        <div class="expanded-heading">

            <span class="expanded-category">
                ${place.category}
            </span>

            <h2>
                ${place.name}
            </h2>

            <p class="expanded-location">
                📍 ${place.location}
            </p>

        </div>


        <!-- Tagline -->
        <p class="expanded-tagline">
            ${place.tagline}
        </p>


        <!-- Description -->
        <p class="expanded-description">
            ${place.description}
        </p>


        <!-- Destination Facts -->
        <div class="expanded-facts">


            <!-- Rating -->
            <div class="fact">

                <span class="fact-icon">
                    ★
                </span>

                <div>

                    <small>
                        Rating
                    </small>

                    <strong>
                        ${place.rating}
                    </strong>

                </div>

            </div>


            <!-- Best Time -->
            <div class="fact">

                <span class="fact-icon">
                    🕐
                </span>

                <div>

                    <small>
                        Best Time
                    </small>

                    <strong>
                        ${place.bestTime}
                    </strong>

                </div>

            </div>


            <!-- Entry Fee -->
            <div class="fact">

                <span class="fact-icon">
                    🎟
                </span>

                <div>

                    <small>
                        Entry Fee
                    </small>

                    <strong>
                        ${place.entryFee}
                    </strong>

                </div>

            </div>


            <!-- Timings -->
            <div class="fact">

                <span class="fact-icon">
                    🕒
                </span>

                <div>

                    <small>
                        Timings
                    </small>

                    <strong>
                        ${place.timings}
                    </strong>

                </div>

            </div>


        </div>


        <!-- Location / Maps -->
        <div class="expanded-map">

            <div class="map-placeholder">

                <span>
                    📍
                </span>

                <span>
                    ${place.location}
                </span>

            </div>


            <a
                class="google-maps-btn"
                href="${createGoogleMapsUrl(place)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Open in Google Maps →
            </a>

        </div>


        <!-- Add To Whiteboard -->
        <button
            class="add-whiteboard-btn"
            type="button"
        >
            + Add to Whiteboard
        </button>


    </div>

`;


                // --------------------------------
                // EXPANDED CARD WHITEBOARD BUTTON
                // --------------------------------

                const expandedButton =
                    Excard.querySelector(
                        ".add-whiteboard-btn"
                    );

                expandedButton.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();

                        addToWhiteboard(place);

                    }
                );

                const closeButton =
                    Excard.querySelector(".close-expanded");

                closeButton.addEventListener("click", (event) => {

                    event.stopPropagation();

                    Excard.remove();

                });


                // --------------------------------
                // EXPANDED CARD CLASS
                // --------------------------------

                Excard.className =
                    "d-cards expanded-card";


                destinationsGrid.appendChild(
                    Excard
                );

            }
        );


        // --------------------------------
        // ADD NORMAL CARD TO GRID
        // --------------------------------

        destinationsGrid.appendChild(card);

    }
}



function createGoogleMapsUrl(place) {

    const query = [
        place.name,
        place.state
    ]
        .filter(Boolean)
        .join(", ");

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}


// =========================
// ADD TO WHITEBOARD
// =========================
function addToWhiteboard(place) {

    const whiteboardPlace = {

        name: place.name,

        state: place.state || selectedState,

        category: place.category,

        description: place.description,

        imageQuery: place.imageQuery,

        latitude: place.latitude,

        longitude: place.longitude

    };


    let whiteboard =
        JSON.parse(
            localStorage.getItem(
                "bharatWhiteboard"
            )
        ) || [];


    whiteboard.push(
        whiteboardPlace
    );


    localStorage.setItem(
        "bharatWhiteboard",
        JSON.stringify(
            whiteboard
        )
    );


    console.log(
        "Added to Whiteboard:",
        whiteboardPlace
    );

}