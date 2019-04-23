// ==UserScript==
// @name Dideo Extension
// @include *
// @include https://*
// @include about:blank
// @exclude http://www.dideo.ir/*
// @exclude https://www.dideo.ir/*
// @require src/js/jquery.min.js
// ==/UserScript==
chrome.runtime.sendMessage({ loadURL: true });
var $ = window.$.noConflict(true); // Required for IE

function addStyle(cssCode, id) {
  if (id && document.getElementById(id)) return;
  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  if (id) styleElement.id = id;
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = cssCode;
  } else {
    styleElement.appendChild(document.createTextNode(cssCode));
  }
  var father = null;
  var heads = document.getElementsByTagName("head");
  if (heads.length > 0) {
    father = heads[0];
  } else {
    if (typeof document.documentElement != "undefined") {
      father = document.documentElement;
    } else {
      var bodies = document.getElementsByTagName("body");
      if (bodies.length > 0) {
        father = bodies[0];
      }
    }
  }
  if (father != null) father.appendChild(styleElement);
}

var details = {
  url: "src/style/content.css",
  method: "GET",
  async: false,
  contentType: "text"
};
kango.xhr.send(details, function(data) {
  var content = data.response;
  addStyle(content);
});
kango.invokeAsync("checkUpdate", function(response) {});

kango.invokeAsync("status", function(response) {
  var enable = response.enable;
  if (enable) loadDideo(response.homeURL);
});

function youtubeLinkFinder(blockSites, homeURL, isOpen) {
  $("a").each(function(index, value) {
    var attr = $(this).attr("dideo-checked");
    var parent_class = $(this)
      .parent()
      .attr("class");
    if (
      (typeof attr === typeof undefined || attr === false) &&
      parent_class != "th _lyb _YQd"
    ) {
      $(this).attr("dideo-checked", true);
      var link = this.href;
      var url = this.linkUrl;
      var href = this.href;
      var dideoImage =
        '<div class="dideo-tooltip"><img  class="dideo-img" src="data:image/png;base64,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" alt="" /><span class="tooltiptext">در دیدئو ببینید</span></div>';
      for (var i = 0; i < blockSites.length; i++) {
        var item = blockSites[i];
        if (!item.enabled_link) continue;
        var parser = document.createElement("a");
        parser.href = link;
        var path_name = parser.pathname;
        path_name = path_name.split("/");
        if (path_name.length > 1) {
          path_name = path_name[1];
          if (
            item.host_names.includes(parser.hostname) &&
            item.path_names.includes(path_name)
          ) {
            var link2 = homeURL + "/extension/redirect?url=" + link;
            var e = $(
              "<a target='_blank' dideo-checked=true href='" +
                link2 +
                "'> " +
                dideoImage +
                " </a>"
            );
            e.insertAfter(this);
          }
        }
      }
    }
  });
}

function loadDideo(homeURL) {
  currentLocation = window.location.href;
  kango.invokeAsync("getInfo", currentLocation, function(response) {
    var blockSites = response.blockSites;
    var isOpen = response.isOpen;
    var isOpenLink = response.isOpenLink;
    var isOpenEmbed = response.isOpenEmbed;
    if (isOpen) {
      youtubeLinkFinder(blockSites, homeURL, isOpenLink);
      youtubeIframFinder(blockSites, homeURL, isOpenEmbed);
      setInterval(function() {
        youtubeLinkFinder(blockSites, homeURL, isOpenLink);
        youtubeIframFinder(blockSites, homeURL, isOpenEmbed);
      }, 3000);
    }
  });
}

var youtubeIframFinder = function(blockSites, homeURL, isOpen) {
  $("iframe").each(function() {
    var attr = $(this).attr("dideo-checked");
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
        if (!site.enabled_embed) continue;
        var parser = document.createElement("a");
        parser.href = src;
        var path_name = parser.pathname;
        path_name = path_name.split("/");
        if (path_name.length > 1) {
          path_name = path_name[1];
          if (
            site.host_names.includes(parser.hostname) &&
            site.embed_path_names.includes(path_name)
          ) {
            // if (src.includes(site.embed_url)) {
            $(this).attr("dideo-checked", true);
            var targetURL = homeURL + "/extension/embed";
            var url = btoa(src);
            var abbr = btoa(site.abbr);

            kango.invokeAsync("getEmbedLink", abbr, url, function(response) {
              if (isOpen) {
                frame.attr("src", response);
                frame.attr("data-lazy-src", response);
              }
            });
          }
        }
      }
    }
  });
};
