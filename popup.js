document.getElementById('calculateBtn').addEventListener('click', function() {
    let earnings = parseFloat(document.getElementById('earnings').value);
    let selectedCurrency = document.getElementById('currency-select').value;

    if (isNaN(earnings) || earnings <= 0) {
        document.getElementById('result').textContent = "Please enter a valid earnings amount.";
        return;
    }

    const currencySymbols = {
        "USD": "$",
        "EUR": "€",
        "GBP": "£",
        "INR": "₹"
    };

    chrome.runtime.sendMessage({ action: "fetchExchangeRates" }, function(response) {
        if (response.error) {
            document.getElementById('result').textContent = response.error;
            return;
        }

        let exchangeRates = response.rates;

        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "getPrice" }, function(response) {
                if (response && response.price && response.currency) {
                    let itemPrice = parseFloat(response.price);
                    let itemCurrency = response.currency;

                    if (isNaN(itemPrice) || itemPrice <= 0) {
                        document.getElementById('result').textContent = "Couldn't fetch the price.";
                    } else {
                        let itemPriceInUSD = itemPrice / exchangeRates[itemCurrency];
                        let itemPriceInSelectedCurrency = itemPriceInUSD * exchangeRates[selectedCurrency];
                        let days = Math.ceil(itemPriceInSelectedCurrency / earnings);

                        document.getElementById('result').textContent = 
                            `You need to work for ${days} day(s). Price: ${currencySymbols[selectedCurrency]}${itemPriceInSelectedCurrency.toFixed(2)}`;
                    }
                } else {
                    document.getElementById('result').textContent = response.error || "Couldn't fetch the item price.";
                }
            });
        });
    });
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('shareBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const url = tabs[0].url;
        const title = tabs[0].title;
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            alert('Web Share API not supported in this browser.');
        }
    });
});
