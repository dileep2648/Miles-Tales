const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const destinationRoutes = require("./routes/destinationRoutes");
const optimizationRoutes = require("./routes/optimizationRoutes");

const app = express();
app.use(express.static(path.join(__dirname, "../Frontend")));

app.use(cors());
app.use(express.json());
app.use("/api/destinations", destinationRoutes);
app.use("/api/optimization", optimizationRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bharat backend is running!");
});

app.get("/api/test", (req, res) => {

    const name = req.query.name;

    res.json({
        message: `Hello ${name}!`,
        project: "Bharat"
    });

});

app.post("/api/test", (req, res) => {

    const data = req.body;

    console.log(data);

    res.json({
        message: "Data received successfully!",
        receivedData: data
    });

});


app.get("/api/image", async (req, res) => {

    try {

        const query = req.query.query;

        if (!query) {
            return res.status(400).json({
                error: "Image query is required"
            });
        }

        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
            {
                headers: {
                    Authorization: process.env.PEXELS_API_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error("Pexels API request failed");
        }

        const data = await response.json();

        const image =
            data.photos?.[0]?.src?.large2x || "";

        res.json({
            image
        });

    } catch (error) {

        console.error("Pexels error:", error);

        res.status(500).json({
            error: "Failed to fetch image"
        });
    }
});

app.post("/api/transport", async (req, res) => {

    try {

        const { from, to, mode } = req.body;

        console.log("Transport request:", {
            from,
            to,
            mode
        });

        if (!from || !to || !mode) {
            return res.status(400).json({
                error: "from, to and mode are required"
            });
        }

        res.json({
            message: "Transport request received",
            from,
            to,
            mode
        });

    } catch (error) {

        console.error("Transport error:", error);

        res.status(500).json({
            error: "Transport request failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Miles & Tales server running on port ${PORT}`);
});