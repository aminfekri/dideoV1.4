var iframes = $("iframe");
var last_page_content = "";

enable = false;
var blockSites;
chrome.runtime.sendMessage({ variable: "enable" }, function(response) {
  enable = response.en;
  chrome.runtime.sendMessage({ variable: "blockSites" }, function(response) {
    blockSites = response.sites;
    // console.log(enable);
    // console.log(blockSites);
    if (enable) {
      youtubeIframFinder();
      youtubeLinkFinder();
      $(document).ready(
        setTimeout(function() {
          youtubeLinkFinder();
          youtubeIframFinder();
        }, 3000)
      );
      $(document).on("change", document, function() {
        setTimeout(function() {
          youtubeIframFinder();
          youtubeLinkFinder();
        }, 3000);
      });
      $(document).on("click", "a", function() {
        setTimeout(function() {
          youtubeIframFinder();
          youtubeLinkFinder();
        }, 3000);
      });
      $(document).on("mouseenter", "iframe", function() {
        setTimeout(function() {
          youtubeIframFinder();
        }, 500);
      });

      document.addEventListener("keydown", keyDownTextField, false);
      function keyDownTextField(e) {
        var keyCode = e.keyCode;
        setTimeout(function() {
          youtubeIframFinder();
          youtubeLinkFinder();
        }, 3000);
      }
    }
  });
});
var youtubeIframFinder = function() {
  var url = $(location).attr("host");
  if (
    url.toLowerCase().indexOf("dideo.ir") < 0 &&
    url.toLowerCase().indexOf("localhost") < 0
  ) {
    // alert('after call');
    $("iframe").each(function() {
      var attr = $(this).attr("asb");
      if (typeof attr === typeof undefined || attr === false) {
        var src = $(this).attr("src");
        var frame = $(this);
        for (
          var i = 0;
          i < blockSites.length &&
          typeof src !== typeof undefined &&
          src !== false;
          i++
        ) {
          var site = blockSites[i];
          if (src.includes(site.embed_url)) {
            $(this).attr("asb", "boz");
            var targetURL = "https://www.dideo.ir/extension/embed";
            var url = btoa(src);
            var abbr = btoa(site.abbr);
            var data = {
              variable: "embed",
              url: btoa(src),
              abbr: btoa(site.abbr)
            };
            chrome.runtime.sendMessage(data, function(response) {
              frame.attr("src", response.link);
              frame.attr("data-lazy-src", response.link);
            });
          }
        }
      }
    });
  }
};
var auto = function(e) {
  if (e) {
    chrome.tabs.getCurrent(function(tab) {
      var tabUrl = encodeURIComponent(tab.url);
      var tabTitle = encodeURIComponent(tab.title);
      var myNewUrl = "https://www.dideo.ir/extension/redirect?url=" + tabUrl;

      chrome.tabs.update(tab.id, { url: myNewUrl });
    });
  } else {
  }
};
var youtubeLinkFinder = function() {
  $("a").each(function(index, value) {
    var attr = $(this).attr("asb");
    if (typeof attr === typeof undefined || attr === false) {
      $(this).attr("asb", "boz");
      var link = this.href;
      var url = this.linkUrl;
      var href = this.href;
      var dideoImage =
        '<div class="tooltip"><img width="25" height="25" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAMAAAAB8C7XAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAC2VBMVEX///8AAAD4o7f1VX74eZn8doH8d4H4eZj1U3z4o7f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0OGbzOGfzN2f1KV7////////////////////////////////////zN2fzN2fzN2fzN2f0Nmb////////////////////////////////zN2fzN2fzN2fzN2fyNWb////////////////////////////zN2fzN2fzN2fzN2fzNGT////////////////////////zN2fzN2fzN2fzN2fyJ1L////////////////////////zN2fzN2fzN2fzN2f////////////////////zN2fzN2fzM2D////////////zN2fzN2fzM2H////////////zN2fzN2f////////////////////xJ1H////////////////////////zNGT////////////////////////zN2fzN2fzN2fzN2fyNWb////////////////////////////zN2fzN2fzN2fzN2f0Nmf////////////////////////////////zOGfzN2fzN2f1KF7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zN2fzN2fzN2fzN2fzN2fzN2fzN2fzN2fzN2fzN2fCtgr2AAAA6HRSTlMAAAAAAAAAAAAAGpPs7qIzA5L5/tp3Guz7xVgM8POpPAWg/f/miiUBH5jv/dNrFQhMuvj5vU8JE2rT/u80Ax9eNAMAJYnm/+GAHwCS++KDIAQ7qvT8zWAOrf3PZRENWsf79qYirfi2Rwcaet3/rhet7ZcuAgIumO75eP/ddxUHSLf5zf2PARGb9v2PARGc9XcVB0i4+cwCAi+Y7vl3Bxt63v+uF639z2URDVvI+/alIZH74oMgBT2q9fzNYA4eXTQDACWL5//hgB8AFGzV/u+gNAMJTrz4vU8JH5jwoP3v7JL5GpLr7aIzaAhRgAAAAAFiS0dEAIgFHUgAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAHdElNRQfgDBQNGA00aetcAAABmUlEQVQoz2Pg4ubh5eMXYGBEAwyCQi9eCIuIijGgSTGIvwABCUkpaVQpBpkXECArJ6+ALMOgqASVUVZRVVNHSDFoaGpBZV5o6+jqwWUYGPQNDI1gUsYmpmZQKQaglLmFpRVMylrRxhYsxWBn7+Do5OziCpNxc/fw9AJKMXj7+Pr5MwQEBgXDpEJCw8KBBkW8fBUZFR3DFBsXnwCTSkxKZmBIef3m7bvUtPQM5sys7ByYVG4eQ/7rN2/evP9QUFhUXFJaVg6VqKiESLx587GquqaWpa6+oREi0wSTePPmbXNLKytDWztEogNJorOrm42hpxci0YdkVP8E9omTJk+BSExFsnza9BkzZ0Etnz0H5Nw3n4DOncsxb/6ChTDnLlrMsOT1q6XLlq/gXLlq9RqY8Np16xkYNmzctHkLw9Zt23fAhHfu2r0HGCR79+0/cPDQ4SMw4aPHjp84yQAJ9lOnz5yFiZ87f+EiJNgZLl2+chUeUdeu34BF1M1bt7FH7Z27OBLDPVzJ5z6uBPfgIY4k+ujxk6fPnmMmagDGHlQgqUleMQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0xMS0xOVQxNDoxNzoxMCswNDowMN38o1wAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMTEtMTlUMTQ6MTY6MTIrMDQ6MDDU/GH3AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==" /><span class="tooltiptext">در دیدئو ببینید</span></div>';

      for (var i = 0; i < blockSites.length; i++) {
        var item = blockSites[i];
        if (link.includes(item.watch_url)) {
          var link = "https://www.dideo.ir/extension/redirect?url=" + href;
          var e = $(
            "<a target='_blank' asb='boz' href='" +
              link +
              "'> " +
              dideoImage +
              " </a>"
          );
          e.insertAfter(this);
        }
      }
    }
  });
};
