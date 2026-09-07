const geocodeDestination = async (query) => {
    const apiKey = process.env.LATLNG_API_KEY;

    if (!apiKey) {
        throw new Error("LATLNG_API_KEY is not configured");
    }

    const url = new URL("https://api.latlng.work/api");

    url.searchParams.set("q", query);
    url.searchParams.set("limit", "1");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-Api-Key": apiKey,
            "Accept": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(
            `LatLng API error: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (
        !data.features ||
        data.features.length === 0 ||
        !data.features[0].geometry ||
        !data.features[0].geometry.coordinates
    ) {
        throw new Error(`No coordinates found for: ${query}`);
    }

    // GeoJSON coordinates are [longitude, latitude]
    const [longitude, latitude] =
        data.features[0].geometry.coordinates;

    return {
        latitude,
        longitude
    };
};

module.exports = {
    geocodeDestination
};