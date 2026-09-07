const { askGroq } = require("../services/groqService");
const { geocodeDestination } = require("../services/geocodingService");

const getDestinations = async (req, res) => {

    const state = req.query.state;

    const prompt = `
You are a travel expert specializing in India.

Give me 5 worthwhile tourist destinations in ${state}, India.

For every destination provide these fields:

- name
- description
- category
- location
- tagline
- rating
- bestTime
- entryFee
- timings
- imageQuery

Use realistic information.
Keep descriptions concise.
For rating, use a number between 1 and 5.
For entryFee, use a simple string such as "Free", "₹50", or "₹200".
For imageQuery, provide a short search phrase suitable for a travel photography image search.

Categories must be one of:
Nature, Heritage, Adventure, Spiritual, Coast, Culture

Return ONLY valid JSON in exactly this structure:

{
    "destinations": [
        {
            "name": "Munnar",
            "description": "...",
            "category": "Nature",
            "location": "Munnar, Kerala",
            "tagline": "...",
            "rating": 4.8,
            "bestTime": "October – March",
            "entryFee": "Varies",
            "timings": "Open throughout the day",
            "imageQuery": "Munnar Kerala tea plantations travel photography"
        }
    ]
}
`;

    try {

        // -----------------------------------
        // 1. GET DESTINATIONS FROM GROQ
        // -----------------------------------

        const result = await askGroq(prompt);

        // -----------------------------------
        // 2. GEOCODE ALL DESTINATIONS
        //    IN PARALLEL
        // -----------------------------------

        const destinationsWithCoordinates =
            await Promise.all(

                result.destinations.map(
                    async (destination) => {

                        try {

                            const coordinates =
                                await geocodeDestination(
                                    `${destination.name}, ${destination.location}, India`
                                );

                            const destinationWithCoordinates = {
                                ...destination,
                                latitude: coordinates.latitude,
                                longitude: coordinates.longitude
                            };

                            console.log(
                                "GEOCODED DESTINATION:",
                                destinationWithCoordinates
                            );

                            return destinationWithCoordinates;

                        } catch (error) {

                            console.error(
                                `Geocoding failed for ${destination.name}:`,
                                error.message
                            );

                            return {
                                ...destination,
                                latitude: null,
                                longitude: null
                            };
                        }
                    }
                )
            );

        // -----------------------------------
        // 3. UPDATE RESULT
        // -----------------------------------

        result.destinations =
            destinationsWithCoordinates;

        console.log(
            "FINAL DESTINATIONS:",
            result.destinations
        );

        // -----------------------------------
        // 4. SEND RESPONSE TO FRONTEND
        // -----------------------------------

        res.json({
            state: state,
            result: result
        });

    } catch (error) {

        console.error(
            "Failed to get destinations:",
            error
        );

        res.status(500).json({
            message: "Failed to get destinations from Groq"
        });
    }
};

module.exports = {
    getDestinations
};