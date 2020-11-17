// content scripts have access to current page, but does not have access to chrome.* APIs with the exception of extension, i18n, and storage

(function(){
  options = {
    attributes: true,
    attributeFilter: ['.atvwebplayersdk-adtimeindicator-text'],
    subtree: true,
    childList: true,
    attributeOldValue: false
  }
  
  function skipAdd(mutations) {
    let videoNode = document.querySelector("#dv-web-player > div > div:nth-child(1) > div > div > div.scalingVideoContainer > div.scalingVideoContainerBottom > div > video");
    let adText = document.querySelector(".atvwebplayersdk-adtimeindicator-text");
  
    if (videoNode != null && adText != null) {
      let adDuration = parseInt(adText.textContent.match(/^\d+|\d+\b|\d+(?=\w)/g)[0]);
      videoNode.currentTime = videoNode.currentTime + adDuration;
  
      console.log(`${adDuration} Second ad detected and skiped`);
    }
  }
  
  globalThis.AmazonAdObserver = new MutationObserver(skipAdd);

  // let nodeToWatch = document.querySelector(".atvwebplayersdk-infobar-container");
  let nodeToWatch = document.body;
  if (nodeToWatch != null) {
    console.log("successfully attached observer")
    globalThis.AmazonAdObserver.observe(nodeToWatch, options);
  } else {
    console.log("Failed to find node to watch :(")
  }

  console.log("Prime video adblock init completed.");
})();