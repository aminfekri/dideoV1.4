﻿"use strict";
(function() {
  var exports = {};
  var NotImplementedException = (exports.NotImplementedException = function(e) {
    (e = e ? e + " " : ""),
      (this.prototype = Error.prototype),
      (this.name = "NotImplementedException"),
      (this.message = "Method " + e + "is not implemented"),
      (this.toString = function() {
        return this.name + ": " + this.message;
      });
  });
  exports.createApiWrapper = function(e) {
    var t = {},
      n = Array.prototype.slice.call(arguments, 1);
    return (
      array.forEach(n, function(n) {
        object.forEach(n, function(n, r) {
          if ("_" != r[0]) {
            if ("undefined" == typeof e[r])
              throw new NotImplementedException(r);
            "function" == typeof e[r]
              ? (t[r] = function() {
                  return e[r].apply(e, arguments);
                })
              : (t[r] = e[r]);
          }
        });
      }),
      t
    );
  };
  var Event = (exports.Event = function(e, t, n) {
      (this.type = e),
        (this.target = n || null),
        (this.result = null),
        "object" == typeof t && object.mixin(this, t);
    }),
    IEventTarget = (exports.IEventTarget = function() {});
  IEventTarget.prototype = {
    addEventListener: function(e, t) {
      throw new NotImplementedException();
    },
    removeEventListener: function(e, t) {
      throw new NotImplementedException();
    }
  };
  var EventTarget = (exports.EventTarget = function() {
    this._eventListeners = {};
  });
  EventTarget.prototype = {
    dispatchEvent: function(e, t) {
      var n = e.type.toLowerCase();
      if ("undefined" != typeof this._eventListeners[n]) {
        for (var r = this._eventListeners[n], o = 0; o < r.length; o++) {
          var i = !1;
          if ("unknown" == typeof r[o].call) i = !0;
          else {
            try {
              var a = r[o](e);
            } catch (u) {
              if (-2146828218 != u.number && -2146823277 != u.number) throw u;
              i = !0;
            }
            "undefined" != typeof a && "undefined" != typeof t && (t.value = a);
          }
          i && (r.splice(o, 1), o--);
        }
        return !0;
      }
      return !1;
    },
    fireEvent: function(e, t) {
      var n = { value: null },
        r = this.dispatchEvent(new Event(e, t), n);
      return r && null != n.value && (t.result = n.value), r;
    },
    addEventListener: function(e, t) {
      if ("undefined" != typeof t.call && "undefined" != typeof t.apply) {
        for (
          var n = e.toLowerCase(),
            r = (this._eventListeners[n] = this._eventListeners[n] || []),
            o = 0;
          o < r.length;
          o++
        )
          if (r[o] == t) return !1;
        return r.push(t), !0;
      }
      return !1;
    },
    removeEventListener: function(e, t) {
      var n = e.toLowerCase();
      if ("undefined" != typeof this._eventListeners[n])
        for (var r = this._eventListeners[n], o = 0; o < r.length; o++)
          if (r[o] == t) return r.splice(o, 1), !0;
      return !1;
    },
    removeAllEventListeners: function() {
      this._eventListeners = {};
    }
  };
  var array = (exports.array = {
      map: function(e, t, n) {
        for (var r = e.length, o = new Array(r), i = 0; r > i; i++)
          o[i] = t.call(n || null, e[i], i);
        return o;
      },
      forEach: function(e, t, n) {
        for (var r = e.length, o = 0; r > o; o++) t.call(n || null, e[o], o);
      },
      filter: function(e, t, n) {
        for (var r = [], o = e.length, i = 0; o > i; i++)
          t.call(n || null, e[i], i) && r.push(e[i]);
        return r;
      },
      remove: function(e, t) {
        for (var n; -1 != (n = e.indexOf(t)); ) e.splice(n, 1);
      }
    }),
    string = (exports.string = {
      format: function(e, t) {
        if ("object" == typeof t && null != t)
          object.forEach(t, function(n, r) {
            e = e.replace(new RegExp("\\{" + r + "}", "g"), t[r]);
          });
        else
          for (var n = 1; n < arguments.length; n++)
            e = e.replace(new RegExp("\\{" + (n - 1) + "}", "g"), arguments[n]);
        return e;
      },
      isAlpha: function(e) {
        return (e >= "a" && "z" >= e) || (e >= "A" && "Z" >= e);
      },
      isDigit: function(e) {
        return e >= "0" && "9" >= e;
      },
      parseUri: function(e) {
        var t = new RegExp(
            "^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"
          ),
          n = e.match(t);
        return {
          scheme: n[2],
          authority: n[4],
          path: n[5],
          query: n[7],
          fragment: n[9]
        };
      },
      escapeRegExp: function(e) {
        return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }),
    object = (exports.object = {
      getKeys: function(e) {
        var t = [];
        for (var n in e) e.hasOwnProperty(n) && t.push(n);
        return t;
      },
      isArray: function(e) {
        return (
          e instanceof Array ||
          "[object Array]" == Object.prototype.toString.call(e)
        );
      },
      isObject: function(e) {
        return (
          "object" == typeof e ||
          "[object Object]" == Object.prototype.toString.call(e)
        );
      },
      isString: function(e) {
        return "string" == typeof e || e instanceof String;
      },
      clone: function(e) {
        return JSON.parse(JSON.stringify(e));
      },
      copy: function(e) {
        var t = {};
        return (
          this.forEach(e, function(e, n) {
            t[n] = e;
          }),
          t
        );
      },
      sanitize: function(e) {
        return JSON.parse(JSON.stringify(e));
      },
      resolveName: function(e, t) {
        for (var n = e, r = t.split("."), o = r.pop(), i = 0; i < r.length; i++)
          n = n[r[i]];
        return { parent: n, terminalName: o };
      },
      resolveOrCreateName: function(e, t) {
        for (var n = e, r = t.split("."), o = r.pop(), i = 0; i < r.length; i++)
          (n[r[i]] = n[r[i]] || {}), (n = n[r[i]]);
        return {
          parent: n,
          terminalName: o,
          setValue: function(e) {
            n[o] = e;
          }
        };
      },
      forEach: function(e, t, n) {
        for (var r in e) e.hasOwnProperty(r) && t.call(n || null, e[r], r);
      },
      extend: function(e, t) {
        return this.mixin(this.create(e.prototype), t);
      },
      mixin: function(e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
        return e;
      },
      create: function(e) {
        var t = function() {};
        return (t.prototype = e), new t();
      },
      freeze: function(e) {
        return Object.freeze ? Object.freeze(e) : e;
      }
    }),
    date = (exports.date = {
      diff: function(e, t) {
        return Math.ceil((e.getTime() - t.getTime()) / 1e3) || 0;
      }
    }),
    func = (exports.func = {
      isCallable: function(e) {
        return (
          "function" == typeof e ||
          (e && "undefined" != typeof e.call && "undefined" != typeof e.apply)
        );
      },
      bind: function(e, t) {
        var n = Array.prototype.slice.call(arguments, 2);
        return function() {
          return e.apply(t, n.concat(Array.prototype.slice.call(arguments, 0)));
        };
      },
      invoke: function(e, t, n) {
        var r = object.resolveName(e, t),
          o = r.parent;
        return o[r.terminalName].apply(o, n);
      },
      decorate: function(e, t) {
        return function() {
          return t.call(this, e, arguments);
        };
      }
    }),
    utils = (exports.utils = {
      getDomainFromId: function(e) {
        for (var t = "", n = 0; n < e.length; n++)
          (string.isAlpha(e[n]) || string.isDigit(e[n]) || "-" == e[n]) &&
            (t += e[n]);
        return t.toLowerCase();
      }
    });
  function InvokeAsyncModule(n, e, r, o) {
    function t(n) {
      var r = arguments[arguments.length - 1],
        o = r.isCallbackInvoke ? s : l,
        t = Array.prototype.slice.call(arguments, 1, arguments.length - 1),
        a = null;
      r.isNotifyInvoke || ((a = c()), (i[a] = r)),
        e(o, { id: a, method: n, params: t });
    }
    var a = "KangoInvokeAsyncModule_result",
      l = "KangoInvokeAsyncModule_invoke",
      s = "KangoInvokeAsyncModule_invokeCallback",
      i = {},
      u = 0,
      c = function() {
        return (Math.random() + u++).toString();
      },
      d = function(n) {
        return "undefined" != typeof n.call && "undefined" != typeof n.apply;
      },
      f = function(n, e) {
        var t = { id: n.id, result: null, error: null };
        try {
          t.result = r(n.method, n.params);
        } catch (l) {
          var s = l.message;
          l.stack && (s += "\nStack:\n" + l.stack),
            (t.error = s),
            o(
              "Error during async call method " + n.method + ". Details: " + s,
              l
            );
        }
        null != n.id && e.dispatchMessage(a, t);
      },
      y = function(n, e) {
        var t = { id: n.id, result: null, error: null };
        try {
          n.params.push(function(r) {
            (t.result = r), null != n.id && e.dispatchMessage(a, t);
          }),
            r(n.method, n.params);
        } catch (l) {
          (t.error = l.toString()),
            null != n.id
              ? e.dispatchMessage(a, t)
              : o(
                  "Error during async call method " +
                    n.method +
                    ". Details: " +
                    t.error,
                  l
                );
        }
      },
      v = function(n, e) {
        if ("undefined" != typeof n.id && "undefined" != typeof i[n.id]) {
          var r = i[n.id];
          try {
            null == n.error && d(r.onSuccess)
              ? r.onSuccess(n.result)
              : d(r.onError) && r.onError(n.error);
          } finally {
            delete i[n.id];
          }
        }
      };
    n("message", function(n) {
      var e = {};
      (e[l] = f), (e[s] = y), (e[a] = v);
      var r = n.data;
      for (var o in e)
        if (e.hasOwnProperty(o) && o == n.name) {
          e[o](r, n.source);
          break;
        }
    });
    var h = function(n, e) {
      e = Array.prototype.slice.call(e, 0);
      var r = e[e.length - 1],
        a = {
          onSuccess: function() {},
          onError: function(n) {
            o("Error during async call method " + e[0] + ". Details: " + n);
          },
          isCallbackInvoke: n,
          isNotifyInvoke: !1
        };
      null != r && d(r)
        ? ((a.onSuccess = function(n) {
            r(n);
          }),
          (e[e.length - 1] = a))
        : ((a.isNotifyInvoke = !0), e.push(a)),
        t.apply(this, e);
    };
    (this.invokeAsync = function(n) {
      h(!1, arguments);
    }),
      (this.invokeAsyncCallback = function(n) {
        h(!0, arguments);
      });
  }
  "undefined" != typeof module && (module.exports = InvokeAsyncModule);
  function StorageSyncModule(e, n, t) {
    var o = "undefined" != typeof module,
      a = "KangoStorage",
      r = {
        setItem: function(n) {
          e.setItem(n.name, n.value, !o);
        },
        removeItem: function(n) {
          return e.removeItem(n.name, !o);
        },
        clear: function() {
          return e.clear(!o);
        }
      };
    n("message", function(e) {
      var n = e.data,
        t = e.name.split("_");
      if (t[0] == a)
        for (var o in r)
          if (r.hasOwnProperty(o) && o == t[1]) {
            r[o](n, e.source);
            break;
          }
    }),
      e.addEventListener("setItem", function(e) {
        t([a, e.type].join("_"), e.data);
      }),
      e.addEventListener("removeItem", function(e) {
        t([a, e.type].join("_"), e.data);
      }),
      e.addEventListener("clear", function(e) {
        t([a, e.type].join("_"));
      });
  }
  "undefined" != typeof module && (module.exports = StorageSyncModule);
  function MessageTargetModule(e) {
    var n = {},
      t = (this.addMessageListener = function(e, t) {
        if ("undefined" != typeof t.call && "undefined" != typeof t.apply) {
          n[e] = n[e] || [];
          for (var r = 0; r < n[e].length; r++) if (n[e][r] == t) return !1;
          return n[e].push(t), !0;
        }
        return !1;
      });
    (this.removeMessageListener = function(e, t) {
      if ("undefined" != typeof n[e])
        for (var r = 0; r < n[e].length; r++)
          if (n[e][r] == t) return n[e].splice(r, 1), !0;
      return !1;
    }),
      (this.removeAllMessageListeners = function() {
        n = {};
      }),
      e("message", function(e) {
        var t = e.name;
        if ("undefined" != typeof n[t])
          for (var r = 0; r < n[t].length; r++) {
            var s = !1;
            if ("unknown" == typeof n[t][r].call) s = !0;
            else
              try {
                n[t][r](e);
              } catch (i) {
                if (-2146828218 != i.number && -2146823277 != i.number) throw i;
                s = !0;
              }
            s && (n[t].splice(r, 1), r--);
          }
      }),
      (this.onMessage = function(e, n, r) {
        t(e, function(e) {
          n(e.data, function(n, t) {
            e.source.dispatchMessage(n, t);
          });
        });
      });
  }
  "undefined" != typeof module && (module.exports = MessageTargetModule);
  function initStorage(n) {
    var e = n;
    (kango.storage = {
      setItem: function(n, o, t) {
        "undefined" != typeof o
          ? "function" != typeof o &&
            ((e[n] = o),
            t || this.fireEvent("setItem", { data: { name: n, value: o } }))
          : this.removeItem(n);
      },
      getItem: function(n) {
        return "undefined" != typeof e[n] ? e[n] : null;
      },
      removeItem: function(n, o) {
        delete e[n], o || this.fireEvent("removeItem", { data: { name: n } });
      },
      getKeys: function() {
        var n = [];
        for (var o in e) e.hasOwnProperty(o) && n.push(o);
        return n;
      },
      clear: function(n) {
        (e = {}), n || this.fireEvent("clear");
      }
    }),
      object.mixin(kango.storage, EventTarget.prototype),
      object.mixin(kango.storage, new EventTarget()),
      StorageSyncModule(
        kango.storage,
        func.bind(kango.addEventListener, kango),
        func.bind(kango.dispatchMessage, kango)
      );
  }
  function initI18n(n, e) {
    var o = e;
    kango.i18n = {
      getMessages: function() {
        return o;
      },
      getMessage: function(n) {
        var e = o[n] ? o[n] : n;
        return arguments.length > 1
          ? string.format.apply(
              string,
              [e].concat(Array.prototype.slice.call(arguments, 1))
            )
          : e;
      },
      getCurrentLocale: function() {
        return n;
      }
    };
  }
  function initApi() {
    initMessaging();
    var n = new MessageTargetModule(func.bind(kango.addEventListener, kango));
    (kango.addMessageListener = func.bind(n.addMessageListener, n)),
      (kango.removeMessageListener = func.bind(n.removeMessageListener, n));
    var e = new InvokeAsyncModule(
      func.bind(kango.addEventListener, kango),
      func.bind(kango.dispatchMessage, kango),
      null,
      func.bind(kango.console.log, kango.console)
    );
    (kango.invokeAsync = e.invokeAsync),
      (kango.invokeAsyncCallback = e.invokeAsyncCallback),
      kango.invokeAsync("modules/kango/extension_info/getRawData", function(n) {
        (kango.getExtensionInfo = function() {
          return n;
        }),
          kango.invokeAsync("modules/kango/storage/storage.getItems", function(
            n
          ) {
            initStorage(n),
              kango.invokeAsync("modules/kango/i18n/getCurrentLocale", function(
                n
              ) {
                kango.invokeAsync("modules/kango/i18n/getMessages", function(
                  e
                ) {
                  initI18n(n, e), apiReady.fire();
                });
              });
          });
      });
  }
  var kango = (window.kango = {});
  (kango.lang = {
    evalInSandbox: function(n, e, o) {
      new Function(e + "\n//# sourceURL=sandboxed-" + o + ".js")();
    },
    evalScriptsInSandbox: function(n, e, o) {
      for (var t = "", a = 0; a < e.length; a++) {
        for (var r = 0; r < e[a].requires.length; r++)
          t += e[a].requires[r].text + "\n\n";
        t += e[a].text + "\n\n";
      }
      return this.evalInSandbox(n, t, o);
    }
  }),
    (kango.console = {
      log: function(n) {
        console.log(n);
      },
      warn: function(n) {
        console.warn(n);
      },
      error: function(n) {
        console.error(n);
      }
    }),
    (kango.tab = {
      isPrivate: function() {
        return !1;
      }
    }),
    (kango.xhr = {
      send: function(n, e) {
        var o = n.contentType;
        ("xml" == o || "json" == o) && (n.contentType = "text"),
          (n.sanitizeData = !0),
          kango.invokeAsyncCallback("kango.xhr.send", n, function(t) {
            if ("" != t.response && null != t.response)
              if ("json" == o)
                try {
                  t.response = JSON.parse(t.response);
                } catch (a) {
                  t.response = null;
                }
              else if ("xml" == o)
                try {
                  var r = new DOMParser();
                  t.response = r.parseFromString(t.response, "text/xml");
                } catch (a) {
                  t.response = null;
                }
            (n.contentType = o), e(t);
          });
      }
    });
  var apiReady = (function() {
    var n = !1,
      e = [];
    return {
      on: function(o) {
        n ? o() : e.push(o);
      },
      fire: function() {
        (n = !0),
          array.forEach(e, function(n) {
            n();
          }),
          (e = []);
      }
    };
  })();

  function initMessaging() {
    var e = [];
    chrome.runtime.onMessage.addListener(function(n, t) {
      (n.source = n.target = kango),
        "undefined" != typeof n.tab &&
          (kango.tab.isPrivate = function() {
            return n.tab.isPrivate;
          });
      for (var r = 0; r < e.length; r++) e[r](n);
    }),
      (kango.dispatchMessage = function(e, n) {
        var t = { name: e, data: n, origin: "tab", source: null, target: null };
        return chrome.runtime.sendMessage(t), !0;
      }),
      (kango.addEventListener = function(n, t) {
        if ("message" == n) {
          for (var r = 0; r < e.length; r++) if (e[r] == t) return;
          e.push(t);
        }
      });
  }
  (kango.browser = {
    getName: function() {
      return "chrome";
    }
  }),
    (kango.io = {
      getResourceUrl: function(e) {
        return chrome.extension.getURL(e);
      }
    });
  function runContentScripts(n) {
    var t = window == window.top;
    kango.invokeAsync(
      "modules/kango/userscript_engine/getScripts",
      window.document.URL,
      n,
      t,
      function(t) {
        object.forEach(t, function(t, o) {
          kango.lang.evalScriptsInSandbox(window, t, o + "-" + n);
        });
      }
    );
  }
  window.addEventListener(
    "DOMContentLoaded",
    function() {
      apiReady.on(function() {
        runContentScripts("document-end");
      });
    },
    !1
  ),
    apiReady.on(function() {
      runContentScripts("document-start");
    }),
    initApi();
})();
