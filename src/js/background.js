var enable;
enable = localStorage["enable"];

if (enable == undefined) {
  localStorage["enable"] = true;
  enable = true;
}

function updateIcon() {
  if (!enable) chrome.browserAction.setIcon({ path: "icons/enable.png" });
  else chrome.browserAction.setIcon({ path: "icons/disable.png" });
  enable = !enable;
  localStorage["enable"] = enable;
}

chrome.browserAction.onClicked.addListener(updateIcon);

var blockSites = [
  {
    abbr: "yt",
    embed_url: "//www.youtube.com/embed/",
    watch_url: "//www.youtube.com/watch",
    host_names: [
      "www.youtube.com",
      "www.m.youtube.com",
      "youtube.com",
      "m.youtube.com"
    ],
    path_names: ["watch"],
    embed_path_names: ["embed"],
    searchs: ["?v="],
    enabled_embed: true,
    enabled_link: true
  },
  {
    abbr: "ap",
    embed_url: "//www.aparat.com/video/video/embed/videohash/",
    watch_url: "//www.aparat.com/v",
    host_names: ["www.aparat.com", "aparat.com"],
    path_names: ["v"],
    embed_path_names: ["video"],
    searchs: ["search"],
    enabled_embed: false,
    enabled_link: true
  }
];

var text;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.variable == "enable") sendResponse({ en: enable });

  if (request.variable == "blockSites") {
    sendResponse({ sites: blockSites });
  }

  if (request.variable == "embed") {
    var url = request.url;
    // alert('+++++++ ===== url send to embed is: \n' + atob(url));
    var abbr = request.abbr;
    var params = "url=" + url + "&abbr=" + abbr;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.dideo.ir/extension/embed?" + params, false);
    xhr.onreadystatechange = function() {
      // alert(xhr.responseText);
      // text = xhr.responseText;
      text = JSON.parse(xhr.responseText);
    };
    xhr.send();
    sendResponse({ link: text });
  }
});
