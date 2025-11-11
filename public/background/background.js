// Fetch currency rates (example)
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "getCurrencyRate") {
    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${msg.base}`
      );
      const data = await res.json();
      sendResponse({ rates: data.rates });
    } catch (err) {
      sendResponse({ error: err });
    }
  }
  return true; // keeps the channel open for async
});
