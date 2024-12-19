function extractPriceAndCurrency() {
    let price = "";
    let currency = "";

    // Common currency symbols and their regex patterns
    const currencyPatterns = {
        "USD": /\$\s?(\d+[\.,]?\d*)/,
        "EUR": /€\s?(\d+[\.,]?\d*)/,
        "GBP": /£\s?(\d+[\.,]?\d*)/,
        "INR": /₹\s?(\d+[\.,]?\d*)/,
        // Add more currencies as needed
    };

    // Extract price based on the website
    if (window.location.hostname.includes("amazon")) {
        price = document.querySelector('.a-price .a-offscreen') ? document.querySelector('.a-price .a-offscreen').innerText : "";
    } else if (window.location.hostname.includes("flipkart")) {
        price = document.querySelector('._30jeq3') ? document.querySelector('._30jeq3').innerText : "";
    } else if (window.location.hostname.includes("myntra")) {
        price = document.querySelector('.pdp-price') ? document.querySelector('.pdp-price').innerText : "";
    } else if (window.location.hostname.includes("ebay")) {
        price = document.querySelector('.x-price-approx__price') ? document.querySelector('.x-price-approx__price').innerText : "";
    }
   

    console.log("Extracted price:", price);

    // Attempt to extract currency using known patterns
    for (let [curr, pattern] of Object.entries(currencyPatterns)) {
        if (price.match(pattern)) {
            currency = curr;
            price = price.match(pattern)[1].replace(/,/g, ''); 
            break;
        }
    }

    console.log("Extracted currency:", currency);

    return { price, currency };
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getPrice") {
        let { price, currency } = extractPriceAndCurrency();
        if (price && currency) {
            sendResponse({ price: price, currency: currency });
        } else {
            sendResponse({ error: "Price or currency not found" });
        }
    }
});
