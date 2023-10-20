const utils = {
  hideElement(element) {
    element.style.display = "none";
  },

  isVisible(element) {
    const computedStyle = window.getComputedStyle(element);
    return (
      computedStyle.display !== "none" &&
      element.offsetWidth > 0 &&
      element.offsetHeight > 0
    );
  },

  getZIndex(element) {
    const zIndex = parseInt(window.getComputedStyle(element).zIndex);
    return isNaN(zIndex) ? 0 : zIndex;
  },

  collectParents(element, predicate) {
    const matchedElements = [];
    while (element && element !== document.body) {
      if (predicate(element)) matchedElements.push(element);
      element = element.parentNode;
    }
    return matchedElements;
  },
};

function overlayRemover(utils) {
  function hidePotentialOverlayElements(element) {
    const thresholdZIndex = utils.getZIndex(element);
    [...element.parentNode.children].forEach((child) => {
      if (utils.getZIndex(child) >= thresholdZIndex) {
        utils.hideElement(child);
      }
    });
  }

  function removeBlurFromElement(element) {
    if (window.getComputedStyle(element).filter.includes("blur")) {
      element.style.filter = "blur(0)";
    }
  }

  function restoreScrollForContainers() {
    [document.documentElement, document.body].forEach((element) => {
      const style = window.getComputedStyle(element);
      if (style.overflowY === "hidden") {
        element.style.overflow = "auto";
      }
      if (style.position === "fixed") {
        element.style.position = "static";
      }
    });
  }

  function run() {
    const potentialOverlay = document.elementFromPoint(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    const elementsWithZIndex = utils.collectParents(
      potentialOverlay,
      (el) => utils.getZIndex(el) > 0
    );

    if (elementsWithZIndex.length === 0) {
      return;
    }

    elementsWithZIndex.forEach((el) => {
      hidePotentialOverlayElements(el);
      removeBlurFromElement(el);
    });

    restoreScrollForContainers();
  }

  return {
    run,
  };
}

const overlayRemoverInstance = overlayRemover(utils);

function overlayRemoverRun() {
  overlayRemoverInstance.run();
}
