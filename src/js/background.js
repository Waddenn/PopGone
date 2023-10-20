const browserAction = chrome || browser;

browserAction.browserAction.onClicked.addListener(() => {
  browserAction.tabs.executeScript(
    { file: "src/js/overlay_remover.js" },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      browserAction.tabs.executeScript({ code: "overlayRemoverRun();" });
    }
  );
});
