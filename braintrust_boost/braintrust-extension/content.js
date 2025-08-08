
// Braintrust Circle extension – content.js
console.log("[Braintrust] content script loaded");

const CHAT_SELECTORS = {
  chatgpt: '[data-testid="conversation-turn"]',
  claude: '.Message',
  gemini: '[data-message-type="MESSAGE_TYPE_MODEL"]'
};

function sendToBraintrust(service, role, content) {
  chrome.runtime.sendMessage({
    type: 'NEW_CHAT_MESSAGE',
    service,
    role,
    content
  });
}

// Helper: extract role/content for ChatGPT
function parseChatGPT(node) {
  const roleEl = node.querySelector('[data-message-author-role]');
  const contentEl = node.querySelector('[data-message-content]');
  if (!roleEl || !contentEl) return;
  sendToBraintrust('chatgpt', roleEl.dataset.messageAuthorRole, contentEl.textContent.trim());
}

// TODO: similar parsers for Claude & Gemini when DOM confirmed
function parseMessageNode(node) {
  if (node.matches?.(CHAT_SELECTORS.chatgpt)) return parseChatGPT(node);
  if (node.matches?.(CHAT_SELECTORS.claude)) {
    // Placeholder – implement once selectors stabilise
    // const role = node.classList.contains('assistant') ? 'assistant' : 'user';
    // sendToBraintrust('claude', role, node.textContent.trim());
  }
  if (node.matches?.(CHAT_SELECTORS.gemini)) {
    const role = node.getAttribute('data-message-type') === 'MESSAGE_TYPE_USER' ? 'user' : 'assistant';
    sendToBraintrust('gemini', role, node.textContent.trim());
  }
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      parseMessageNode(node);
    });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
