// Bharat Whiteboard
// Dynamic destination cards + draggable cards + n8n-style smooth connections
// + localStorage persistence

// ===== IMAGE API =====


const routeBtn = document.getElementById("routeBtn");
const routePrompt = document.getElementById("routePrompt");
const routePromptText = document.getElementById("routePromptText");
const routeSkip = document.getElementById("routeSkip");

const board = document.getElementById("board");
const shapeJourneyBtn = document.getElementById("shapeJourneyBtn");


const routeTypeOptions = document.getElementById("routeTypeOptions");
const openRouteBtn = document.getElementById("openRouteBtn");
const closedRouteBtn = document.getElementById("closedRouteBtn");

const journeyResultOverlay = document.getElementById("journeyResultOverlay");
const journeyRouteList = document.getElementById("journeyRouteList");
const journeyDestinationCount = document.getElementById("journeyDestinationCount");
const journeyType = document.getElementById("journeyType");

const discardConfirmOverlay = document.getElementById("discardConfirmOverlay");
const discardCancelBtn = document.getElementById("discardCancelBtn");
const keepBoardBtn = document.getElementById("keepBoardBtn");
const eraseBoardBtn = document.getElementById("eraseBoardBtn");
const discardJourneyBtn = document.getElementById("discardJourneyBtn");
const closeJourneyResult = document.getElementById("closeJourneyResultBtn")
const printJourneyBtn = document.getElementById("printJourneyBtn");

let routeType = null;

let routeMode = false;
let routeStep = "start";

let routeStartCard = null;
let routeEndCard = null;


let selectedTransport = null;
let activeConnection = null;
let transportConnection = null;

async function getImage(query) {
  const response = await fetch(
    `http://localhost:3000/api/image?query=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  return data.image || "";
}

// ===== WHITEBOARD =====

document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");

  const routeSvg = document.querySelector(".route-lines");

  const populatedView = document.getElementById("populatedView");

  const emptyView = document.getElementById("emptyView");

  const toggleBtn = document.getElementById("toggleBtn");

  if (!board || !routeSvg) {
    console.warn("Whiteboard elements not found.");
    return;
  }

  // ===== STORAGE =====

  const STORAGE_KEY = "bharatWhiteboardLayout";

  // ===== STATE =====

  let connections = [];

  let draggingCard = null;

  let cardOffsetX = 0;
  let cardOffsetY = 0;

  let activeConnection = null;

  let connectionTarget = null;

  // ===== BASIC HELPERS =====

  function getCards() {
    return [...document.querySelectorAll(".pin-card")];
  }

  function getCardId(card) {
    return card.dataset.destinationId;
  }

  function createDestinationId(place) {
    const state = place.state || "unknown";
    const name = place.name || "destination";
    return `${state}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // ===== EMPTY / POPULATED PREVIEW =====

  if (toggleBtn && populatedView && emptyView) {
    toggleBtn.addEventListener("click", () => {
      const showingEmpty = !emptyView.hidden;

      emptyView.hidden = showingEmpty;
      populatedView.hidden = !showingEmpty;
      toggleBtn.textContent = populatedView.hidden
        ? "Preview populated board"
        : "Preview empty board state";
    });
  }

  // ===== CARD SETUP =====

  function setupCards() {
    getCards().forEach((card, index) => {
      card.dataset.cardIndex = index;

      // CARD DRAGGING

      card.addEventListener("pointerdown", startCardDrag);
      // ROUTE CARD SELECTION
      card.addEventListener("click", (event) => {

        if (routeMode) {
          event.stopPropagation();
          selectRouteCard(card);
          return;
        }

      });

      // REMOVE BUTTON

      const removeButton = card.querySelector(".remove-btn");

      if (removeButton) {
        removeButton.addEventListener("pointerdown", (event) => {
          event.stopPropagation();
        });

        removeButton.addEventListener("click", (event) => {
          event.stopPropagation();

          removeCard(card);
        });
      }

      // CONNECTION HANDLES

      const handles = card.querySelectorAll(".connection-handle");

      handles.forEach((handle) => {
        handle.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          event.stopPropagation();

          startConnection(event, card);
        });
      });
    });
  }

  // ===== REMOVE CARD =====

  function removeCard(card) {
    const destinationId = getCardId(card);

    // Remove destination from localStorage

    let saved = JSON.parse(localStorage.getItem("bharatWhiteboard")) || [];

    saved = saved.filter((place) => createDestinationId(place) !== destinationId);

    localStorage.setItem("bharatWhiteboard", JSON.stringify(saved));

    // Remove connections involving card

    connections = connections.filter(
      (connection) => connection.from !== destinationId && connection.to !== destinationId,
    );

    // Remove card visually

    card.remove();

    // Re-index cards

    getCards().forEach((remainingCard, index) => {
      remainingCard.dataset.cardIndex = index;
    });

    saveLayout();

    renderWires();

    updateEmptyState();
  }

  // ===== CARD DRAGGING =====

  function startCardDrag(event) {
    /*
     * Do NOT start card dragging when clicking
     * any button / connection handle.
     */

    if (event.target.closest("button")) {
      return;
    }

    draggingCard = event.currentTarget;

    const boardRect = board.getBoundingClientRect();

    const pointerX = event.clientX - boardRect.left;

    const pointerY = event.clientY - boardRect.top;

    /*
     * Important:
     * Cards may have CSS rotation.
     * offsetLeft / offsetTop prevent the
     * initial jump.
     */

    const cardLeft = draggingCard.offsetLeft;

    const cardTop = draggingCard.offsetTop;

    const style = getComputedStyle(draggingCard);

    const transform = style.transform;

    const originParts = style.transformOrigin.split(" ");

    const originX = parseFloat(originParts[0]) || 0;

    const originY = parseFloat(originParts[1]) || 0;

    let localX = pointerX - cardLeft;

    let localY = pointerY - cardTop;

    /*
     * Undo CSS transform so the
     * grabbed position stays fixed.
     */

    if (transform && transform !== "none") {
      const matrix = new DOMMatrix(transform);

      const x = localX - originX;

      const y = localY - originY;

      const determinant = matrix.a * matrix.d - matrix.b * matrix.c;

      if (determinant !== 0) {
        const inverseX = (matrix.d * x - matrix.c * y) / determinant;

        const inverseY = (-matrix.b * x + matrix.a * y) / determinant;

        localX = inverseX + originX;

        localY = inverseY + originY;
      }
    }

    cardOffsetX = localX;

    cardOffsetY = localY;

    draggingCard.classList.add("dragging");

    draggingCard.setPointerCapture(event.pointerId);

    draggingCard.addEventListener("pointermove", moveCard);

    draggingCard.addEventListener("pointerup", stopCardDrag);

    draggingCard.addEventListener("pointercancel", stopCardDrag);

    event.preventDefault();
  }

  function moveCard(event) {
    if (!draggingCard) return;

    const boardRect = board.getBoundingClientRect();

    const pointerX = event.clientX - boardRect.left;

    const pointerY = event.clientY - boardRect.top;

    let newLeft = pointerX - cardOffsetX;

    let newTop = pointerY - cardOffsetY;

    const maxLeft = board.clientWidth - draggingCard.offsetWidth - 10;

    const maxTop = board.clientHeight - draggingCard.offsetHeight - 10;

    newLeft = Math.max(10, Math.min(newLeft, maxLeft));

    newTop = Math.max(10, Math.min(newTop, maxTop));

    draggingCard.style.left = `${newLeft}px`;

    draggingCard.style.top = `${newTop}px`;

    renderWires();
  }

  function stopCardDrag(event) {
    if (!draggingCard) return;

    draggingCard.classList.remove("dragging");

    draggingCard.removeEventListener("pointermove", moveCard);

    draggingCard.removeEventListener("pointerup", stopCardDrag);

    draggingCard.removeEventListener("pointercancel", stopCardDrag);

    try {
      draggingCard.releasePointerCapture(event.pointerId);
    } catch { }

    draggingCard = null;

    saveLayout();
  }

  // ===== CONNECTION PORTS =====

  function getPortPoint(card, side) {
    const boardRect = board.getBoundingClientRect();

    const cardRect = card.getBoundingClientRect();

    let x;
    let y;

    switch (side) {
      case "top":
        x = cardRect.left + cardRect.width / 2;

        y = cardRect.top;

        break;

      case "right":
        x = cardRect.right;

        y = cardRect.top + cardRect.height / 2;

        break;

      case "bottom":
        x = cardRect.left + cardRect.width / 2;

        y = cardRect.bottom;

        break;

      case "left":
        x = cardRect.left;

        y = cardRect.top + cardRect.height / 2;

        break;

      default:
        x = cardRect.right;

        y = cardRect.top + cardRect.height / 2;
    }

    const svgWidth = routeSvg.viewBox.baseVal.width || 970;

    const svgHeight = routeSvg.viewBox.baseVal.height || 700;

    return {
      x: ((x - boardRect.left) / boardRect.width) * svgWidth,

      y: ((y - boardRect.top) / boardRect.height) * svgHeight,
    };
  }

  function getClosestSide(card, pointerX, pointerY) {
    const rect = card.getBoundingClientRect();

    const distances = {
      top: Math.abs(pointerY - rect.top),

      right: Math.abs(pointerX - rect.right),

      bottom: Math.abs(pointerY - rect.bottom),

      left: Math.abs(pointerX - rect.left),
    };

    return Object.keys(distances).reduce((closest, side) => {
      return distances[side] < distances[closest] ? side : closest;
    });
  }

  // ===== SVG POINTER POSITION =====

  function getPointerSvgPoint(event) {
    const boardRect = board.getBoundingClientRect();

    const svgWidth = routeSvg.viewBox.baseVal.width || 970;

    const svgHeight = routeSvg.viewBox.baseVal.height || 700;

    return {
      x: ((event.clientX - boardRect.left) / boardRect.width) * svgWidth,

      y: ((event.clientY - boardRect.top) / boardRect.height) * svgHeight,
    };
  }

  // ===== BEZIER ROUTING =====

  function getDirection(side) {
    switch (side) {
      case "top":
        return {
          x: 0,
          y: -1,
        };

      case "right":
        return {
          x: 1,
          y: 0,
        };

      case "bottom":
        return {
          x: 0,
          y: 1,
        };

      case "left":
        return {
          x: -1,
          y: 0,
        };

      default:
        return {
          x: 1,
          y: 0,
        };
    }
  }

  function getControlPoints(start, end, startSide, endSide) {
    const startDirection = getDirection(startSide);

    const endDirection = getDirection(endSide);

    const dx = end.x - start.x;

    const dy = end.y - start.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    /*
     * Controls become longer for
     * longer journeys, but remain
     * visually controlled.
     */

    const curve = Math.max(55, Math.min(180, distance * 0.45));

    const control1 = {
      x: start.x + startDirection.x * curve,

      y: start.y + startDirection.y * curve,
    };

    const control2 = {
      x: end.x + endDirection.x * curve,

      y: end.y + endDirection.y * curve,
    };

    return {
      control1,
      control2,
    };
  }

  function createBezierPath(start, end, startSide, endSide) {
    const { control1, control2 } = getControlPoints(start, end, startSide, endSide);

    return `
            M ${start.x} ${start.y}
            C
            ${control1.x} ${control1.y},
            ${control2.x} ${control2.y},
            ${end.x} ${end.y}
        `;
  }

  // ===== CONNECTION START =====

  function startConnection(event, card) {
    const side = event.currentTarget.dataset.side;

    if (!side) {
      console.warn("Connection handle has no side.");

      return;
    }

    const cards = getCards();

    const startIndex = cards.indexOf(card);

    activeConnection = {
      startCard: card,

      startId: getCardId(card),

      startIndex: startIndex,

      startSide: side,

      currentX: 0,

      currentY: 0,
    };

    card.classList.add("connection-source");

    document.addEventListener("pointermove", moveConnection);

    document.addEventListener("pointerup", finishConnection);

    document.addEventListener("pointercancel", cancelConnection);

    moveConnection(event);
  }

  // ===== CONNECTION MOVE =====

  function moveConnection(event) {
    if (!activeConnection) return;

    const pointer = getPointerSvgPoint(event);

    activeConnection.currentX = pointer.x;

    activeConnection.currentY = pointer.y;

    const element = document.elementFromPoint(event.clientX, event.clientY);

    const targetCard = element?.closest(".pin-card");

    if (targetCard && targetCard !== activeConnection.startCard) {
      if (connectionTarget !== targetCard) {
        if (connectionTarget) {
          connectionTarget.classList.remove("connection-target");
        }

        connectionTarget = targetCard;

        connectionTarget.classList.add("connection-target");
      }
    } else {
      if (connectionTarget) {
        connectionTarget.classList.remove("connection-target");

        connectionTarget = null;
      }
    }

    renderTemporaryWire();
  }

  // ===== TEMPORARY WIRE =====

  function renderTemporaryWire() {
    if (!activeConnection) return;

    routeSvg.innerHTML = "";

    const start = getPortPoint(activeConnection.startCard, activeConnection.startSide);

    const end = {
      x: activeConnection.currentX,

      y: activeConnection.currentY,
    };

    /*
     * For the temporary endpoint,
     * use a natural direction based
     * on where the pointer is.
     */

    const dx = end.x - start.x;

    const dy = end.y - start.y;

    let temporaryEndSide;

    if (Math.abs(dx) > Math.abs(dy)) {
      temporaryEndSide = dx >= 0 ? "left" : "right";
    } else {
      temporaryEndSide = dy >= 0 ? "top" : "bottom";
    }

    const pathData = createBezierPath(start, end, activeConnection.startSide, temporaryEndSide);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    path.setAttribute("d", pathData);

    path.setAttribute("fill", "none");

    path.setAttribute("stroke", "#B65432");

    path.setAttribute("stroke-width", "2.4");

    path.setAttribute("stroke-linecap", "round");

    path.setAttribute("stroke-dasharray", "6 6");

    path.setAttribute("opacity", "0.8");

    routeSvg.appendChild(path);
  }

  // ===== FINISH CONNECTION =====

  function finishConnection(event) {
    if (!activeConnection) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);

    const targetCard = element?.closest(".pin-card");

    if (targetCard && targetCard !== activeConnection.startCard) {
      const targetId = getCardId(targetCard);

      const targetSide = getClosestSide(targetCard, event.clientX, event.clientY);

      /*
       * Prevent duplicate connection
       * in the same direction.
       */

      const alreadyExists = connections.some(
        (connection) => connection.from === activeConnection.startId && connection.to === targetId,
      );

      if (!alreadyExists) {
        const newConnection = {
          id: `connection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

          from: activeConnection.startId,

          to: targetId,

          fromSide: activeConnection.startSide,

          toSide: targetSide,
        };

        connections.push(newConnection);

        saveLayout();

        openTransportPanel(newConnection);

        console.log("Connection created:", newConnection);
      }
    }

    cancelConnection();
  }

  // ===== OPEN TRANSPORT PANEL =====

  function openTransportPanel(connection) {
    console.log("OPENING TRANSPORT FOR:", connection);

    transportConnection = connection;

    console.log("ACTIVE CONNECTION SET:", transportConnection);

    const overlay = document.getElementById("transportOverlay");
    const route = document.getElementById("transportRoute");

    const fromCard = document.querySelector(`[data-id="${connection.from}"]`);

    const toCard = document.querySelector(`[data-id="${connection.to}"]`);

    const fromName = fromCard?.querySelector("h3")?.textContent || "Origin";

    const toName = toCard?.querySelector("h3")?.textContent || "Destination";

    route.textContent = `${fromName} → ${toName}`;

    overlay.classList.add("active");

    selectedTransport = null;
  }

  document.querySelectorAll(".transport-option").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".transport-option").forEach((btn) => {
        btn.classList.remove("selected");
      });

      option.classList.add("selected");

      selectedTransport = option.dataset.mode;

      console.log("Selected transport:", selectedTransport);
    });
  });

  document.getElementById("transportClose").addEventListener("click", () => {
    document.getElementById("transportOverlay").classList.remove("active");
  });

  document.getElementById("transportContinue").addEventListener("click", async () => {
    console.log("TRANSPORT CONNECTION AT CONTINUE:");
    console.log(transportConnection);

    console.log("SELECTED TRANSPORT:");
    console.log(selectedTransport);

    if (!transportConnection) {
      console.error("transportConnection is NULL!");
      return;
    }

    if (!selectedTransport) {
      alert("Please choose a transport option.");
      return;
    }

    const response = await fetch("http://localhost:3000/api/transport", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        from: transportConnection.from,
        to: transportConnection.to,
        mode: selectedTransport,
      }),
    });

    const data = await response.json();

    console.log("Transport API response:", data);

    transportConnection.transport = {
      mode: selectedTransport,
    };

    console.log("UPDATED CONNECTION:", transportConnection);

    document.getElementById("transportOverlay").classList.remove("active");
  });

  // ===== CANCEL CONNECTION =====

  function cancelConnection() {
    if (connectionTarget) {
      connectionTarget.classList.remove("connection-target");

      connectionTarget = null;
    }

    if (activeConnection?.startCard) {
      activeConnection.startCard.classList.remove("connection-source");
    }

    activeConnection = null;

    document.removeEventListener("pointermove", moveConnection);

    document.removeEventListener("pointerup", finishConnection);

    document.removeEventListener("pointercancel", cancelConnection);

    renderWires();
  }

  // ===== RENDER SAVED CONNECTIONS =====

  function renderWires() {
    routeSvg.innerHTML = "";

    const cards = getCards();

    if (cards.length < 2 || connections.length === 0) {
      return;
    }

    connections.forEach((connection, index) => {
      const startCard = cards.find((card) => getCardId(card) === connection.from);

      const endCard = cards.find((card) => getCardId(card) === connection.to);

      if (!startCard || !endCard) {
        return;
      }

      const start = getPortPoint(startCard, connection.fromSide);

      const end = getPortPoint(endCard, connection.toSide);

      const pathData = createBezierPath(start, end, connection.fromSide, connection.toSide);

      /*
       * Group
       */

      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      group.classList.add("board-wire");

      group.dataset.connection = index;

      /*
       * Invisible wide hit area
       */

      const hitPath = document.createElementNS("http://www.w3.org/2000/svg", "path");

      hitPath.setAttribute("d", pathData);

      hitPath.setAttribute("fill", "none");

      hitPath.setAttribute("stroke", "transparent");

      hitPath.setAttribute("stroke-width", "18");

      hitPath.setAttribute("stroke-linecap", "round");

      hitPath.style.pointerEvents = "stroke";

      /*
       * Visible smooth wire
       */

      const visiblePath = document.createElementNS("http://www.w3.org/2000/svg", "path");

      visiblePath.setAttribute("d", pathData);

      visiblePath.setAttribute("fill", "none");

      visiblePath.setAttribute("stroke", "#B65432");

      visiblePath.setAttribute("stroke-width", "2.4");

      visiblePath.setAttribute("stroke-linecap", "round");

      visiblePath.setAttribute("opacity", "0.72");

      visiblePath.style.pointerEvents = "none";

      /*
       * Arrow head
       */

      const arrow = document.createElementNS("http://www.w3.org/2000/svg", "circle");

      arrow.setAttribute("cx", end.x);

      arrow.setAttribute("cy", end.y);

      arrow.setAttribute("r", "3.5");

      arrow.setAttribute("fill", "#B65432");

      /*
       * Build
       */

      group.appendChild(hitPath);

      group.appendChild(visiblePath);

      group.appendChild(arrow);

      routeSvg.appendChild(group);

      /*
       * Connection click
       *
       * This will later open the
       * transport information panel.
       */

      hitPath.addEventListener("click", (event) => {
        event.stopPropagation();

        console.log("Connection selected:", connection);
      });
    });
  }

  // ===== SAVE LAYOUT =====

  function saveLayout() {
    const layout = {
      cards: getCards().map((card) => ({
        id: getCardId(card),

        left: card.style.left,

        top: card.style.top,
      })),

      connections: connections,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  }

  // ===== LOAD LAYOUT =====

  function loadLayout() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      renderWires();

      return;
    }

    try {
      const layout = JSON.parse(saved);

      const cards = getCards();

      // CARD POSITIONS

      if (layout.cards) {
        layout.cards.forEach((position) => {
          const card = cards.find((card) => getCardId(card) === position.id);

          if (!card) return;

          if (position.left) {
            card.style.left = position.left;
          }

          if (position.top) {
            card.style.top = position.top;
          }
        });
      }

      // CONNECTIONS

      if (Array.isArray(layout.connections)) {
        /*
         * New connection format
         */

        connections = layout.connections.filter((connection) => connection.from && connection.to);

        /*
         * Backwards compatibility:
         * old format used startIndex/endIndex.
         */

        if (connections.length === 0 && Array.isArray(layout.connections)) {
          connections = layout.connections
            .map((oldConnection) => {
              if (oldConnection.startIndex === undefined || oldConnection.endIndex === undefined) {
                return null;
              }

              const fromCard = cards[oldConnection.startIndex];

              const toCard = cards[oldConnection.endIndex];

              if (!fromCard || !toCard) {
                return null;
              }

              return {
                id: `connection-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

                from: getCardId(fromCard),

                to: getCardId(toCard),

                fromSide: oldConnection.startSide || "right",

                toSide: oldConnection.endSide || "left",
              };
            })
            .filter(Boolean);
        }
      }
    } catch (error) {
      console.warn("Could not load whiteboard layout.", error);
    }

    renderWires();
  }

 // ===== CLEAR BOARD =====

function clearBoard() {

    getCards().forEach((card) => card.remove());

    connections = [];

    localStorage.removeItem(STORAGE_KEY);

    localStorage.removeItem("bharatWhiteboard");

    renderWires();

    updateEmptyState();
}


const clearButton = [...document.querySelectorAll(".toolbar-btn")].find((button) =>
    button.textContent.toLowerCase().includes("clear board"),
);

if (clearButton) {
    clearButton.addEventListener("click", () => {

        const confirmed = confirm(
            "Clear all destinations from your whiteboard?"
        );

        if (!confirmed) return;

        clearBoard();
    });
}

  // ===== EMPTY STATE =====

  function updateEmptyState() {
    const hasCards = getCards().length > 0;

    if (populatedView) {
      populatedView.hidden = !hasCards;
    }

    if (emptyView) {
      emptyView.hidden = hasCards;
    }
  }

  // ===== LOAD DESTINATIONS =====

  async function loadWhiteboardDestinations() {
    const savedDestinations = JSON.parse(localStorage.getItem("bharatWhiteboard")) || [];
    /*
     * Remove any hardcoded demo cards.
     */
    board.querySelectorAll(".pin-card").forEach((card) => card.remove());
    /*
     * Create actual user cards.
     */

    for (const [index, place] of savedDestinations.entries()) {
      const card = document.createElement("article");

      const destinationId = createDestinationId(place);

      card.className = `pin-card card-${index + 1}`;

      card.dataset.destinationId = destinationId;

      card.dataset.cardIndex = index;

      card.innerHTML = `

                <!-- Destination pin -->

                <span class="pin-mark">

                    <svg viewBox="0 0 20 20">

                        <circle
                            cx="10"
                            cy="10"
                            r="6"
                            fill="#B65432"
                        />

                        <circle
                            cx="10"
                            cy="10"
                            r="2"
                            fill="#8F5F17"
                        />

                    </svg>

                </span>

                <!-- Remove -->

                <button
                    class="remove-btn"
                    title="Remove from board"
                    type="button">

                    ×

                </button>

                <!-- Connection handles -->

                <button
                    class="connection-handle handle-top"
                    type="button"
                    data-side="top"
                    title="Connect">
                </button>

                <button
                    class="connection-handle handle-right"
                    type="button"
                    data-side="right"
                    title="Connect">
                </button>

                <button
                    class="connection-handle handle-bottom"
                    type="button"
                    data-side="bottom"
                    title="Connect">
                </button>

                <button
                    class="connection-handle handle-left"
                    type="button"
                    data-side="left"
                    title="Connect">
                </button>

                <!-- Image -->

                <div class="card-photo">

                    <img
                        src=""
                        alt="${place.name}"
                    >

                </div>

                <!-- Information -->

                <div class="card-body">

                    <h3>
                        ${place.name}
                    </h3>

                    <p class="card-meta">

                        ${place.state}

                        <span class="divider-dot">
                            ·
                        </span>

                        <span class="cat">
                            ${place.category}
                        </span>

                    </p>

                    <p class="card-desc">
                        ${place.description}
                    </p>

                </div>

            `;

      board.appendChild(card);

      /*
       * Load image.
       */

      const image = await getImage(place.imageQuery);
      const imageElement = card.querySelector(".card-photo img");
      if (imageElement) {
        imageElement.src = image;
      }
    }
  }

  const routeButton = document.querySelector("#routeBtn");

  routeButton.addEventListener("click", async () => {
    const saved = JSON.parse(localStorage.getItem("bharatWhiteboard")) || [];


    const routableDestinations = saved.filter(
      place =>
        typeof place.latitude === "number" &&
        typeof place.longitude === "number"
    );
    const cards = [...document.querySelectorAll(".pin-card")];

    const startIndex = routeStartCard
      ? routableDestinations.findIndex(
        place => createDestinationId(place) === getCardId(routeStartCard)
      )
      : 0;

    const endIndex = routeEndCard
      ? routableDestinations.findIndex(
        place => createDestinationId(place) === getCardId(routeEndCard)
      )
      : null;

    const roundTrip = routeType === "closed";

    console.log("ROUTE CONFIG:", {
      startIndex,
      endIndex,
      roundTrip
    });



    console.log("SAVED:", saved);
    console.log("ROUTABLE:", routableDestinations);
    console.log(
      "REQUEST BODY:",
      JSON.stringify({
        destinations: routableDestinations
      }, null, 2)
    );
    const response = await fetch("http://localhost:3000/api/optimization/matrix", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        destinations: routableDestinations,
        startIndex,
        endIndex,
        roundTrip
      }),
    }
    );

    console.log("STATUS:", response.status);

    const data = await response.json();

    const optimizedPlaces = data.optimizedRoute.map((index) => data.destinations[index]);

    const routeResult = {
      optimizedRoute: data.optimizedRoute,
      destinations: data.destinations,
      optimizedPlaces: optimizedPlaces,
      matrix: data.matrix,
      startIndex,
      endIndex,
      roundTrip
    };

    console.log("BHARAT ROUTE RESULT:", routeResult);
    renderJourneyRoute(routeResult);
    showJourneyResult(routeResult);
  });


  shapeJourneyBtn.addEventListener("click", () => {
    startRouteSelection();
  });



  routeSkip.addEventListener("click", () => {

    routeMode = false;

    routeStep = "start";

    routeStartCard = null;
    routeEndCard = null;

    board.classList.remove("route-selecting");

    routePrompt.hidden = true;

    removeRouteLabels();

  });

  function startRouteSelection() {

    routeMode = true;
    routeStep = "start";

    routeStartCard = null;
    routeEndCard = null;

    board.classList.add("route-selecting");

    routePrompt.hidden = false;

    routePromptText.textContent =
      "Choose where your journey starts";

    removeRouteLabels();
  }


  function selectRouteCard(card) {

    if (!routeMode) return;

    const placeData = JSON.parse(localStorage.getItem("bharatWhiteboard")) || [];

    const place = placeData.find(
      item => createDestinationId(item) === getCardId(card)
    );

    if (
      !place ||
      typeof place.latitude !== "number" ||
      typeof place.longitude !== "number"
    ) {
      routePromptText.textContent =
        "This destination can't be used for routing yet.";

      return;
    }

    // START
    if (routeStep === "start") {

      routeStartCard = card;

      card.classList.add("route-start");

      addRouteLabel(card, "START", "start");

      routeStep = "end";

      routePromptText.textContent =
        "Now choose where your journey ends";


      return;
    }


    // END
    if (routeStep === "end") {

      // Don't allow same card as start
      if (card === routeStartCard) return;

      routeEndCard = card;

      card.classList.add("route-end");

      addRouteLabel(card, "END", "end");

      routeStep = "type";
      routeType = null;

      routePromptText.textContent =
        "How should your journey work?";

      routeTypeOptions.hidden = false;

      return;
    }
  }

  openRouteBtn.addEventListener("click", () => {

    routeType = "open";

    openRouteBtn.classList.add("selected");
    closedRouteBtn.classList.remove("selected");

    routePromptText.textContent =
      "Open journey selected";

    routeMode = false;
    routePrompt.hidden = true;
    routeTypeOptions.hidden = true;
    board.classList.remove("route-selecting");

  });

  closedRouteBtn.addEventListener("click", () => {

    routeType = "closed";

    closedRouteBtn.classList.add("selected");
    openRouteBtn.classList.remove("selected");

    routePromptText.textContent =
      "Closed journey selected";

    routeMode = false;
    routePrompt.hidden = true;
    routeTypeOptions.hidden = true;
    board.classList.remove("route-selecting");

  });


  function addRouteLabel(card, textContent, type) {

    const existing = card.querySelector(".route-label");

    if (existing) {
      existing.remove();
    }

    const label = document.createElement("span");

    label.className = `route-label ${type}`;
    label.textContent = textContent;

    card.appendChild(label);
  }


  function removeRouteLabels() {

    document
      .querySelectorAll(".route-label")
      .forEach(label => label.remove());

    document
      .querySelectorAll(".pin-card.route-start")
      .forEach(card => {
        card.classList.remove("route-start");
      });

    document
      .querySelectorAll(".pin-card.route-end")
      .forEach(card => {
        card.classList.remove("route-end");
      });
  }


  function showJourneyResult(routeResult) {

    console.log("MATRIX OBJECT:", routeResult.matrix);
    console.log("DISTANCES:", routeResult.matrix?.distances);
    console.log("DURATIONS:", routeResult.matrix?.durations);

    console.log("ROUTE MATRIX:", routeResult.matrix);

    const totals = calculateJourneyTotals(routeResult);

    journeyDestinationCount.textContent =
      routeResult.destinations.length;

    journeyType.textContent =
      routeResult.roundTrip
        ? "Closed journey"
        : "Open journey";

    journeyTotalDistance.textContent =
      `${(totals.totalDistance / 1000).toFixed(1)} km`;

    const totalMinutes =
      Math.round(totals.totalDuration / 60);

    const hours =
      Math.floor(totalMinutes / 60);

    const minutes =
      totalMinutes % 60;

    journeyTotalDuration.textContent =
      `${hours}h ${minutes}m`;

    journeyResultOverlay.hidden = false;
  }

  function renderJourneyRoute(routeResult) {

    journeyRouteList.innerHTML = "";

    const route = routeResult.optimizedRoute;
    const destinations = routeResult.destinations;
    const distances = routeResult.matrix.distances;
    const durations = routeResult.matrix.durations;

    route.forEach((destinationIndex, index) => {

      const place = destinations[destinationIndex];

      const stop = document.createElement("div");

      stop.className = "journey-stop";

      stop.innerHTML = `
            <div class="journey-stop-marker">
                ${index + 1}
            </div>

            <div class="journey-stop-info">
                <span class="journey-stop-label">
                    ${index === 0
          ? "START"
          : index === route.length - 1
            ? "END"
            : `STOP ${index}`
        }
                </span>

                <h4>${place.name}</h4>

                <p>
                    ${place.state || ""}
                </p>
            </div>
        `;

      journeyRouteList.appendChild(stop);


      // CONNECTION TO NEXT DESTINATION
      if (
        index < route.length - 1 ||
        (routeResult.roundTrip && index === route.length - 1)
      ) {

        const from = route[index];

        const to =
          index < route.length - 1
            ? route[index + 1]
            : route[0];

        const distance =
          distances[from][to];

        const duration =
          durations[from][to];

        const leg = document.createElement("div");

        leg.className = "journey-leg";

        const distanceKm =
          (distance / 1000).toFixed(1);

        const totalMinutes =
          Math.round(duration / 60);

        const hours =
          Math.floor(totalMinutes / 60);

        const minutes =
          totalMinutes % 60;

        const durationText =
          hours > 0
            ? `${hours}h ${minutes}m`
            : `${minutes}m`;

        leg.innerHTML = `
                <div class="journey-leg-line"></div>

                <div class="journey-leg-info">
                    ${distanceKm} km · ${durationText}
                </div>
            `;

        journeyRouteList.appendChild(leg);
      }
    });


  }


  function calculateJourneyTotals(routeResult) {

    const route = routeResult.optimizedRoute;
    const distances = routeResult.matrix.distances;
    const durations = routeResult.matrix.durations;

    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 0; i < route.length - 1; i++) {

      const from = route[i];
      const to = route[i + 1];

      totalDistance += distances[from][to];
      totalDuration += durations[from][to];
    }

    // Closed journey: add final leg back to start
    if (routeResult.roundTrip && route.length > 1) {

      const last = route[route.length - 1];
      const start = route[0];

      totalDistance += distances[last][start];
      totalDuration += durations[last][start];
    }

    return {
      totalDistance,
      totalDuration
    };
  }

  editJourneyBtn.addEventListener("click", () => {

    journeyResultOverlay.hidden = true;

});


discardJourneyBtn.addEventListener("click", () => {

    discardConfirmOverlay.hidden = false;

});

discardCancelBtn.addEventListener("click", () => {
    discardConfirmOverlay.hidden = true;
});

closeJourneyResult.addEventListener("click",() => {
  journeyResultOverlay.hidden = true;
});

keepBoardBtn.addEventListener("click", () => {

    discardConfirmOverlay.hidden = true;
    journeyResultOverlay.hidden = true;

});

eraseBoardBtn.addEventListener("click", () => {

    clearBoard();
    discardConfirmOverlay.hidden = true;
    journeyResultOverlay.hidden = true;

});


printJourneyBtn.addEventListener("click", () => {
    window.print();
});

  // ===== INITIALIZE =====

  async function initializeWhiteboard() {
    await loadWhiteboardDestinations();

    setupCards();

    loadLayout();

    updateEmptyState();

    renderWires();
  }
  initializeWhiteboard();

  // ===== RESIZE =====

  window.addEventListener("resize", renderWires);
});
