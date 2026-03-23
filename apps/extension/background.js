// Background service worker for NeuroFlow Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log("NeuroFlow AI Extension Installed");
});

// Listener for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "RUN_NEUROFLOW") {
    // Call backend API
    fetch("http://localhost:3000/api/runNeuroFlow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input: request.input, context: request.context })
    })
    .then(res => res.json())
    .then(data => sendResponse({ success: true, data }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    
    return true; // Keep message channel open for async response
  }
  
  if (request.type === "CHECK_PROACTIVE") {
    fetch("http://localhost:3000/api/proactive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: request.context })
    })
    .then(res => res.json())
    .then(data => sendResponse(data))
    .catch(err => sendResponse({ suggestion: null }));
    return true;
  }
});
