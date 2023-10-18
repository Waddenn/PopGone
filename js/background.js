let chrome = chrome || browser;

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript(
    null,
    { file: "/js/overlay_remover.js" },
    function () {
      chrome.tabs.executeScript(null, { code: "overlayRemoverRun();" });
    }
  );
});
