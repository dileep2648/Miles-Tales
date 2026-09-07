async function getRouteMatrix(destinations) {

    const coordinates = destinations
        .map(destination =>
            `${destination.longitude},${destination.latitude}`
        )
        .join(";");

    const url =
    `https://router.project-osrm.org/table/v1/driving/${coordinates}?annotations=duration,distance`;

    console.log("OSRM REQUEST:", url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `OSRM request failed: ${response.status}`
        );
    }

    const data = await response.json();

    console.log("OSRM RESPONSE:", data);

    return data;
}

module.exports = {
    getRouteMatrix
};