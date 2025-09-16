console.log("Background script loaded"); // Initial log
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("Tab updated:", tabId, changeInfo.status);
  console.log("tab.url value:", tab.url);

  if (
    changeInfo.status === "complete" &&
    tab.url &&
    typeof tab.url === "string" &&
    tab.url.toLowerCase().includes("saltcorn.com")
  ) {
    console.log("Saltcorn.com detected");
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
    console.log("Query parameters:", urlParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      link: tab.url,
    });
    console.log("Message sent to tab:", tabId);
  }
});
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Extension installed/updated");
  if (details.reason === "install") {
    console.log("First time install detected!");
    chrome.storage.sync.set({
      firstInstall: true,
      defaultUrl: "https://calendar.google.com/calendar/u/0/r"
    }, () => {
      console.log("firstInstall=true; defaultUrl=calendar");
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  console.log("Extension icon clicked");

  // Open the side panel
  await chrome.sidePanel.open({
    windowId: tab.windowId,
  });

  // Check firstInstall flag and potentially do something
  chrome.storage.sync.get(["firstInstall"], (result) => {
    if (result.firstInstall === true) {
      console.log("First time icon clicked after install");
      chrome.storage.sync.set({firstInstall: false}, () => {
        console.log("firstInstall=false");
      });
    } else {
      console.log("Icon clicked, not first time");
    }
  });

  // Open Google.com (this will happen *after* the side panel opens and the firstInstall check)
  chrome.tabs.update(tab.id, { url: "if you are seeing this please think of a feature and delete this.com" }); //Idk why is it a google link. Someone check if i'm alright
});
const notificationId = 'my-extension-notification'; // Unique ID for the notification
const targetLink = "https://homework.saltcorn.com/page/ready"; // The link to open

// Function to create the notification
function createNotification() {
  chrome.notifications.create(notificationId, {
    type: 'basic',
    iconUrl: 'assets/ext-icon.png', // Replace with your extension's icon
    title: 'Important Reminder',
    message: 'Time to tell Josiah to check up on his basement! Close this to snooze indefinitely.', // add "snooze indeifidly here"
    buttons: [
      { title: 'Go to Link' },
      { title: 'Snooze 5 minutes' },
      { title: 'Hi' }
    ],
    priority: 2
  });
}

// Function to clear the notification
function clearNotification() {
  chrome.notifications.clear(notificationId);
}
function openTargetLink() {
  chrome.storage.sync.get(['defaultUrl'], (result) => {
    const url = result.defaultUrl; // Get the stored URL
    if (url) {
      chrome.tabs.create({ url: url }); 
      console.log("creation attempted", url)
    } else {
      console.warn("defaultUrl not found in storage.  Perhaps the extension hasn't been installed yet, or the storage was cleared.");
      // Handle the case where defaultUrl is not set (e.g., show an error message)
    }
  });
}
// Listen for notification button clicks
chrome.notifications.onButtonClicked.addListener((clickedNotificationId, buttonIndex) => {
  if (clickedNotificationId === notificationId) {
    switch (buttonIndex) {
      case 0: // Go to Link
        openTargetLink();
        clearNotification(); // Remove the notification
        setTimeout(()=>{
          createNotification();
        },60*60*1000); //change back to normal value later
        break;
      case 1: // Snooze 5 Minutes
        clearNotification();
        setTimeout(() => {
          createNotification(); // Re-create the notification after 5 minutes
        }, 5 * 60 * 1000); // 5 minutes in milliseconds
        break;
      case 2: // Snooze Indefinitely
        clearNotification();
        // You might want to store a flag in storage to prevent future notifications
        chrome.storage.sync.set({ snoozedIndefinitely: true });
        break;
    }
  }
});
chrome.storage.sync.get(['snoozedIndefinitely'], (result) => {
  if (!result.snoozedIndefinitely) {
    // I don't think this is used.....
    setTimeout(() => {
      createNotification();
    }, 1000000000000000000000000000000000000000000000); 
  }
});

// Listen for storage changes (in case snoozedIndefinitely is changed)
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.snoozedIndefinitely) {
    if (changes.snoozedIndefinitely.newValue === false) {
      // If snoozedIndefinitely is set back to false, re-create the notification
      createNotification();
    }
  }
});

createNotification()//for debugging, should be removed after bug fixing