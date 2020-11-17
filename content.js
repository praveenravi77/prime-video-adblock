// content scripts have access to current page, but does not have access to chrome.* APIs with the exception of extension, i18n, and storage

(function(){
  options = {
    attributes: true,
    attributeFilter: ['.atvwebplayersdk-adtimeindicator-text'],
    subtree: true,
    childList: true,
    attributeOldValue: false
  }
  
  var lastAdTime = -1;

  function skipAd(mutations) {
    let videoNode = document.querySelector("#dv-web-player > div > div:nth-child(1) > div > div > div.scalingVideoContainer > div.scalingVideoContainerBottom > div > video");
    let adText = document.querySelector(".atvwebplayersdk-adtimeindicator-text");
  
    if (videoNode != null && adText != null) {
      let adDuration = parseInt(adText.textContent.match(/^\d+|\d+\b|\d+(?=\w)/g)[0]);

      console.log(`${adDuration} Second ad detected`);

      let curr = videoNode.currentTime;
      let afterAd = curr + adDuration;

      // handle back to back ad wonkyness
      if (curr - lastAdTime > 1) {
        console.log("First ad");
        videoNode.currentTime = afterAd;

        console.log(`Time before ad: ${curr}`);
        console.log(`Time after ad: ${videoNode.currentTime}`);

        lastAdTime = afterAd;
        console.log(`lastAdTime: ${lastAdTime}`)
      } else {
        console.log("Second back to back ad");
        console.log(`Time before ad: ${curr}`);
        videoNode.currentTime = afterAd;
        setTimeout(() => { 
          videoNode.currentTime = afterAd - adDuration;
          lastAdTime = -1;
          console.log(`Time after ad: ${videoNode.currentTime}`);
          console.log(`lastAdTime: ${lastAdTime}`)
        }, 100);
      }

      console.log(`${adDuration} Second ad skipped`);
    }
  }
  
  globalThis.AmazonAdObserver = new MutationObserver(skipAd);

  // let nodeToWatch = document.querySelector(".atvwebplayersdk-infobar-container");
  // let nodeToWatch = document.querySelector(("#dv-web-player");
  let nodeToWatch = document.body;
  if (nodeToWatch != null) {
    console.log("successfully attached observer")
    globalThis.AmazonAdObserver.observe(nodeToWatch, options);
  } else {
    console.log("Failed to find node to watch :(")
  }

  console.log("Prime video adblock init completed.");
})();