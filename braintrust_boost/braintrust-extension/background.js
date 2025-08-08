
// Braintrust Circle extension – background.js
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== 'NEW_CHAT_MESSAGE') return;

  const braintrustMessage = {
    id: `ext-${Date.now()}`,
    service: message.service,
    role: message.role,
    content: message.content,
    timestamp: Date.now(),
    metadata: {
      url: sender.tab.url,
      tabId: sender.tab.id
    }
  };

  fetch('http://localhost:5005/ingestDom', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(braintrustMessage)
  }).catch(err => console.error('[Braintrust] relay error', err));
});
