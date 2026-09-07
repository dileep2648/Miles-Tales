const express = require("express");

const { getRouteMatrix } = require("../services/routingService");

const { optimizeRoute } = require("../services/routeOptimizer");

const router = express.Router();


router.post("/matrix", async (req, res) => {


    console.log("🔥 MATRIX REQUEST RECEIVED");
    console.log("BODY:", req.body);

    try {

        const {
    destinations,
    startIndex = 0,
    endIndex = null,
    roundTrip = false
} = req.body;
        

   console.log("DESTINATION COUNT:", destinations?.length);

        if (
            !destinations ||
            destinations.length < 2
        ) {
            return res.status(400).json({
                message:
                    "At least 2 destinations are required"
            });
        }


        const matrix =
            await getRouteMatrix(
                destinations
            );
      console.log("SENDING TO OPTIMIZER:", {
    startIndex,
    endIndex,
    roundTrip
});
        const optimizedRoute =
    await optimizeRoute(
        matrix.durations,
        startIndex,
        endIndex,
        roundTrip
    );

        res.json({
            destinations,
            matrix,
            optimizedRoute
        });

    } catch (error) {

        console.error(
            "Route optimization error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to generate route matrix"
        });
    }
});


module.exports = router;