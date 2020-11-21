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

      let curr = videoNode.currentTime;
      let afterAd = curr + adDuration;

      // handle back to back ad wonkyness
      if (Math.abs(curr - lastAdTime) > 1) {
        videoNode.currentTime = afterAd;

        lastAdTime = afterAd;
      } else {
        videoNode.currentTime = afterAd;
        setTimeout(() => { 
          videoNode.currentTime = afterAd - adDuration;
          lastAdTime = -1;
        }, 100);
      }
    }
  }
  
  globalThis.AmazonAdObserver = new MutationObserver(skipAd);

  // let nodeToWatch = document.querySelector(".atvwebplayersdk-infobar-container");
  // let nodeToWatch = document.querySelector(("#dv-web-player");
  let nodeToWatch = document.body;
  if (nodeToWatch != null) {
    globalThis.AmazonAdObserver.observe(nodeToWatch, options);
  }

})();
