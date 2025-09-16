(() => {
  console.log("Content script is running!");

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { // Corrected
    console.log("Received message:", request);
    // You can access message.type and message.link here
    sendResponse({ received: true }); // Optional response
  });

  console.log("afterruntime");
})();