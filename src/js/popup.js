var StorageTest = {
  init: function() {
    $("#storage-get").click(function(event) {
      StorageTest.testGet();
    });

    $("#storage-set").click(function(event) {
      StorageTest.testSet();
    });

    $("#storage-remove").click(function(event) {
      StorageTest.testRemove();
    });

    $("#storage-keys").click(function(event) {
      StorageTest.testKeys();
    });
  },

  testGet: function() {
    $("#storage-value").val(
      kango.storage.getItem($("#storage-key").val()) || "null"
    );
  },

  testSet: function() {
    kango.storage.setItem($("#storage-key").val(), $("#storage-value").val());
  },

  testRemove: function() {
    kango.storage.removeItem($("#storage-key").val());
    $("#storage-value").val("null");
  },

  testKeys: function() {
    $("#storage-value").val(kango.storage.getKeys().toString());
  }
};

var XhrTest = {
  init: function() {
    $("#xhr-get").click(function(event) {
      XhrTest.testGet();
    });
  },

  testGet: function() {
    var details = {
      url: $("#xhr-url").val(),
      method: "GET",
      async: true,
      contentType: "text"
    };
    kango.xhr.send(details, function(data) {
      $("#xhr-result").val(
        data.status == 200 && data.response != null
          ? data.response
          : "Error. Status=" + data.status
      );
    });
  }
};

var WindowTest = {
  close: function() {
    KangoAPI.closeWindow();
  },

  resize: function() {
    var defaultRows = 4;
    var maximizedRows = 8;
    if ($("#popup-properies").attr("rows") == defaultRows) {
      KangoAPI.resizeWindow(600, 600);
      $("#popup-properies").attr("rows", maximizedRows);
    } else {
      $("#popup-properies").attr("rows", defaultRows);
      KangoAPI.resizeWindow(600, 520);
    }
  }
};

function showPopupProperies() {
  var props = "window.outerWidth=" + window.outerWidth + "\n";
  props += "window.outerHeight=" + window.outerHeight + "\n";
  props +=
    "document.documentElement.clientWidth=" +
    document.documentElement.clientWidth +
    "\n";
  props +=
    "document.documentElement.clientHeight=" +
    document.documentElement.clientHeight +
    "\n";
  props += "document.body.clientWidth=" + document.body.clientWidth + "\n";
  props += "document.body.clientHeight=" + document.body.clientHeight + "\n";
  props += "document.body.offsetWidth=" + document.body.offsetWidth + "\n";
  props += "document.body.offsetHeight=" + document.body.offsetHeight + "\n";
  $("#popup-properies").val(props);
}

KangoAPI.onReady(function() {
  kango.console.error("start");
  kango.invokeAsync("status", function(response) {
    var enable = response.enable;
    var enable2 = response.enable2;
    var tButton = $("#toggle-two");
    if (enable) {
      tButton.bootstrapToggle("on");
      $("#dideo-img").attr("src", "icons/enable.png");
      $("#al1").html("افزونه دیدئو فعال است");
    } else {
      tButton.bootstrapToggle("off");
      $("#dideo-img").attr("src", "icons/disable.png");
      $("#al1").html("افزونه دیدئو غیر فعال است");
    }
    var tButton2 = $("#toggle-tree");
    if (enable2) {
      tButton2.bootstrapToggle("on");
      $("#dideo-img").attr("src", "icons/enable.png");
      $("#al2").html("تغییر خودکار آدرس فعال است");
    } else {
      tButton2.bootstrapToggle("off");
      $("#dideo-img").attr("src", "icons/disable.png");
      $("#al2").html("تغییر خودکار آدرس فعال نیست");
    }
    tButton.change(function() {
      kango.invokeAsync("changeStatus", function(enable) {
        if (!enable) {
          $("#dideo-img").attr("src", "icons/disable.png");
          $("#al1").html(
            "افزونه دیدئو غیر فعال شد.<br> برای اعمال تغییرات صفحه را refresh کنید"
          );
        } else {
          $("#dideo-img").attr("src", "icons/enable.png");
          $("#al1").html(
            "افزونه دیدئو فعال شد.<br> برای اعمال تغییرات صفحه را refresh کنید"
          );
        }
        // KangoAPI.resizeWindow(252, 390);
      });
    });
    tButton2.change(function() {
      kango.invokeAsync("changeStatus2", function(enable) {
        if (!enable) {
          $("#dideo-img").attr("src", "icons/disable.png");
          $("#al2").html(
            "آدرس خودکار غیر فعال شد.<br> برای اعمال تغییرات صفحه را refresh کنید"
          );
        } else {
          $("#dideo-img").attr("src", "icons/enable.png");
          $("#al2").html(
            "آدرس خودکار فعال شد.<br> برای اعمال تغییرات صفحه را refresh کنید"
          );
        }
        // KangoAPI.resizeWindow(252, 390);
      });
    });

    $("#home").click(function() {
      kango.browser.tabs.create({ url: "https://www.dideo.ir/" });
    });

    $("#help").click(function() {
      kango.browser.tabs.create({ url: "http://blog.dideo.ir/?p=218" });
    });
  });
});
