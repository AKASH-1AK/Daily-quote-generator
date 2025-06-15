// Node.js built-in module for making HTTPS requests
const https = require('https'); 

// This is the main function that AWS Lambda will run when triggered.
exports.handler = async (event) => {
    // This is the external API we'll get quotes from.
    // We're using the Chuck Norris Jokes API here as it's reliable!
    const apiUrl = '[https://api.chucknorris.io/jokes/random](https://api.chucknorris.io/jokes/random)'; 

    // We use a Promise to handle the asynchronous nature of the HTTPS request.
    return new Promise((resolve, reject) => {
        https.get(apiUrl, (res) => {
            let data = ''; 

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    // Log the raw data received for debugging purposes
                    console.log("Received data from API:", data); 

                    const jokeData = JSON.parse(data);

                    resolve({
                        statusCode: 200, 
                        headers: {
                            "Content-Type": "application/json", 
                            "Access-Control-Allow-Origin": "*", // Crucial for CORS when frontend is on a different domain
                            "Access-Control-Allow-Methods": "GET,OPTIONS",
                            "Access-Control-Allow-Headers": "Content-Type"
                        },
                        // The frontend expects an array, so we wrap our single quote object.
                        body: JSON.stringify([
                            { text: jokeData.value, author: "Chuck Norris" }
                        ]),
                    });
                } catch (error) {
                    console.error("Error parsing JSON from external API:", error);
                    console.error("Data that failed to parse (check this for HTML!):", data); 
                    reject({
                        statusCode: 500, 
                        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                        body: JSON.stringify({ message: "Failed to process quote data." }),
                    });
                }
            });
        }).on('error', (error) => {
            console.error("Error fetching joke from external API (network/request error):", error);
            reject({
                statusCode: 500, 
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: "Failed to reach external API." }),
            });
        });
    });
};