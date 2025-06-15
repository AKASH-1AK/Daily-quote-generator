document.addEventListener('DOMContentLoaded', () => {
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const refreshButton = document.getElementById('refresh-button');

    // !!! IMPORTANT: You will replace this with your actual API Gateway endpoint later !!!
    // Keep a placeholder for now, like:
    const API_ENDPOINT = 'https://cf3nu32ute.execute-api.ap-south-1.amazonaws.com/prod/quotes'; 

    async function fetchQuote() {
        quoteText.textContent = "Loading a beautiful quote...";
        quoteAuthor.textContent = "- Fetching inspiration";

        try {
            const response = await fetch(API_ENDPOINT);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // The API we are using returns an array of quotes. We'll pick one.
            // If the API returns a single quote object, you might just use data.text and data.author
            const randomQuote = data[Math.floor(Math.random() * data.length)];

            quoteText.textContent = `"${randomQuote.text}"`;
            quoteAuthor.textContent = `- ${randomQuote.author || 'Unknown'}`; // Handle cases where author might be missing

        } catch (error) {
            console.error("Could not fetch quote:", error);
            quoteText.textContent = "Oops! Couldn't load a quote right now.";
            quoteAuthor.textContent = "- Please try again later.";
        }
    }

    refreshButton.addEventListener('click', fetchQuote);

    // Fetch a quote when the page first loads
    fetchQuote();
});