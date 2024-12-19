chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "fetchExchangeRates") {
        fetch("https://openexchangerates.org/api/latest.json?app_id=b238affc7f91461ca23e2f50ed0d4d64")
            .then(response => response.json())
            .then(data => {
                sendResponse({ rates: data.rates });
            })
            .catch(error => {
                console.error("Error fetching exchange rates:", error);
                sendResponse({ error: "Error fetching exchange rates" });
            });
        return true;
    }
});
