const path = require("path");
const { spawn } = require("child_process");

function optimizeRoute(
    durations,
    startIndex = 0,
    endIndex = null,
    roundTrip = false
) {

    return new Promise((resolve, reject) => {

        const optimizerPath = path.join(
            __dirname,
            "..",
            "optimizer.py"
        );

        const python = spawn(
            "python3",
            [optimizerPath]
        );

        let output = "";
        let errorOutput = "";

        python.stdout.on(
            "data",
            (data) => {
                output += data.toString();
            }
        );

        python.stderr.on(
            "data",
            (data) => {
                errorOutput += data.toString();
            }
        );

        python.on(
            "close",
            (code) => {

                if (code !== 0) {

                    return reject(
                        new Error(errorOutput)
                    );
                }

                resolve(JSON.parse(output));
            }
        );
        console.log("SENDING TO PYTHON:", {
            durations,
            startIndex,
            endIndex,
            roundTrip
        });
        python.stdin.write(
            JSON.stringify({
                durations,
                startIndex,
                endIndex,
                roundTrip
            })
        );
        python.stdin.end();
    });
}

module.exports = {
    optimizeRoute
};