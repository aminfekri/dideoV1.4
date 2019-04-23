var config = {
  homeURL: "https://www.dideo.ir",
  updatePageURL: "http://blog.dideo.ir/?p=629",
  installURL: "http://blog.dideo.ir/?p=218"
};
////// redirect
function redi(info) {
  // Redirect the original request to a given URL.
  var url = "https://www.dideo.ir/extension/redirect?url=";
  return { redirectUrl: url + info.url };
}
function auto() {
  if (!enable2) {
    chrome.webRequest.onBeforeRequest.addListener(
      redi,
      // filters
      {
        urls: ["https://www.youtube.com/*"]
      },
      // extraInfoSpec
      ["blocking"]
    );
  } else {
    if (chrome.webRequest.onBeforeRequest.hasListeners()) {
      chrome.webRequest.onBeforeRequest.removeListener(redi);
    }
  }
}
////////// end redirect
var enable = kango.storage.getItem("enable");
if (enable == undefined) {
  enable = true;
  kango.storage.setItem("enable", true);
}
setIcon(enable);
var enable2 = kango.storage.getItem("enable2");
if (enable2 == undefined) {
  enable2 = true;
  kango.storage.setItem("enable2", true);
}
if (enable2) {
  chrome.webRequest.onBeforeRequest.addListener(
    redi,
    // filters
    {
      urls: ["https://www.youtube.com/*"]
    },
    // extraInfoSpec
    ["blocking"]
  );
}
function status() {
  return { enable: enable, homeURL: homeURL, enable2: enable2 };
}
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

var openCountries = ["IR", "Iran"];

var homeURL = config.homeURL;
var updatePageURL = config.updatePageURL;

chrome.runtime.setUninstallURL(
  homeURL + "/extension/uninstalled?browser=chrome"
);
function getInfo(currentLocation) {
  // TODO: check for country according to user IP and open embed video only in openCountries
  var parser = document.createElement("a");
  parser.href = currentLocation;
  var isOpen = true;
  var isOpenLink = true;
  var isOpenEmbed = true;
  blockSites.forEach(function(element) {
    if (element.host_names.includes(parser.hostname)) {
      isOpenLink = false;
      isOpenEmbed = false;
    }
  });
  return {
    isOpenLink: isOpenLink,
    isOpenEmbed: isOpenEmbed,
    blockSites: blockSites,
    isOpen: isOpenEmbed || isOpenLink
  };
}

function changeStatus() {
  var text;
  var icon;
  if (enable) {
    text = "دیدئو - غیرفعال";
    icon = "disable";
  } else {
    text = "دیدئو - فعال";
    icon = "enable";
  }
  enable = !enable;
  kango.storage.setItem("enable", enable);
  kango.ui.browserButton.setTooltipText(text);
  kango.ui.browserButton.setIcon("icons/" + icon + ".png");
  return enable;
}
function changeStatus2() {
  auto();

  if (enable2) {
    text = "آدرس خودکار - غیرفعال";
    icon = "disable";
  } else {
    text = "آدرس خودکار - فعال";
    icon = "enable";
  }
  enable2 = !enable2;

  kango.storage.setItem("enable2", enable2);
  return enable2;
}

function setIcon(enabled) {
  if (!enabled) {
    text = "دیدئو - غیرفعال";
    icon = "disable";
  } else {
    text = "دیدئو - فعال";
    icon = "enable";
  }
  kango.ui.browserButton.setTooltipText(text);
  kango.ui.browserButton.setIcon("icons/" + icon + ".png");
}
function getEmbedLink(abbr, url) {
  var p = { url: url, abbr: abbr };
  var link;
  var details = {
    url: homeURL + "/extension/embed",
    method: "GET",
    async: false,
    params: p,
    contentType: "text"
  };
  kango.xhr.send(details, function(data) {
    var content = data.response;
    var info = JSON.parse(content);
    link = info;
  });
  return link;
}

function MyExtension() {
  var self = this;
  checkInstall();
  kango.ui.browserButton.addEventListener(
    kango.ui.browserButton.event.COMMAND,
    function() {
      self._onCommand();
    }
  );
}

function checkInstall() {
  var seen = kango.storage.getItem("seen");
  if (seen == undefined) {
    kango.storage.setItem("seen", true);
    kango.browser.tabs.create({ url: config.installURL });
    kango.storage.setItem("enable", true);
    // send request for count
    var details = {
      url: homeURL + "/extension/installed",
      method: "GET",
      async: true,
      contentType: "text",
      params: { browser: kango.browser.getName() }
    };
    kango.xhr.send(details, function(data) {});
    //end sending request
    enable = true;
    kango.ui.browserButton.setIcon("icons/enable.png");
  }
}

function checkUpdate() {
  var old_version = kango.storage.getItem("version");
  var info = kango.getExtensionInfo();
  var curr_version = info.version;
  if (old_version != undefined && curr_version != old_version) {
    kango.browser.tabs.create({ url: updatePageURL });
  }
  kango.storage.setItem("version", curr_version);
  return "done";
}
checkUpdate();
MyExtension.prototype = {
  _onCommand: function() {
    var text;
    var icon;
    if (enable) {
      text = "دیدئو - غیرفعال";
      icon = "disable";
    } else {
      text = "دیدئو - فعال";
      icon = "enable";
    }
    enable = !enable;
    kango.storage.setItem("enable", enable);
    kango.ui.browserButton.setTooltipText(text);
    kango.ui.browserButton.setIcon("icons/" + icon + ".png");
  }
};

var extension = new MyExtension();
