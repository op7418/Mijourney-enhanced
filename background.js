chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              urlMatches:
                "(www.midjourney.com|nijijourney.com)/([a-z]{2}/)?app/jobs/",
            },
          }),
        ],
        actions: [new chrome.declarativeContent.RequestContentScript({ js: ['content_script.js'] })],
      },
    ]);
  });
});