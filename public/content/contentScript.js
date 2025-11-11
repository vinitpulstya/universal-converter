// Listen for text selection on any webpage
document.addEventListener("mouseup", () => {
  const selection = window.getSelection()?.toString().trim();
  if (selection) {
    chrome.storage.local.set({ selectedText: selection });
    // Optional: send message to popup for live update
    // chrome.runtime.sendMessage({ type: "selection", text: selection });
  }
});
