﻿"use strict";
_kangoLoader.add("kango/userscript_engine", function(require, exports, module) {
  function UserscriptEngine() {
    (this._scripts = []), this.init();
  }
  function Userscript(e, r) {
    (this.text = e),
      (this.path = r),
      (this.headers = {}),
      (this.requires = []),
      this._parseHeaders();
  }
  var extensionInfo = require("kango/extension_info"),
    io = require("kango/io"),
    utils = require("kango/utils");
  (UserscriptEngine.prototype = {
    init: function() {
      var e = extensionInfo.content_scripts;
      if (e)
        for (var r = 0; r < e.length; r++) {
          var t = io.getExtensionFileContents(e[r]);
          t && this.addScript(e[r], t, io.getExtensionFileUrl(e[r]));
        }
    },
    addScript: function(e, r, t) {
      for (var s = 0; s < this._scripts.length; s++)
        if (this._scripts[s].id == e) return !1;
      var i = new Userscript(r, t || null);
      return (
        this._loadRequiredFiles(i), this._scripts.push({ id: e, script: i }), !0
      );
    },
    removeScript: function(e) {
      for (var r = 0; r < this._scripts.length; r++)
        if (this._scripts[r].id == e) return this._scripts.splice(r, 1), !0;
      return !1;
    },
    clear: function() {
      this._scripts = [];
    },
    getScripts: function(e, r, t) {
      for (var s = {}, i = 0; i < this._scripts.length; i++) {
        var n = this._scripts[i].script,
          a = n.headers.namespace || "default",
          c = n.headers["run-at"] || "document-end",
          h = n.headers["all-frames"] || !1;
        (t || h) &&
          c == r &&
          this._isIncludedUrl(n, e) &&
          !this._isExcludedUrl(n, e) &&
          ((s[a] = s[a] || []),
          s[a].push({ text: n.text, path: n.path, requires: n.requires }));
      }
      return s;
    },
    _loadRequiredFiles: function(e) {
      if ("undefined" != typeof e.headers.require)
        for (var r = e.headers.require, t = 0; t < r.length; t++) {
          var s = r[t],
            i = io.getExtensionFileContents(s);
          null != i &&
            "" != i &&
            e.requires.push({ text: i, path: io.getExtensionFileUrl(s) });
        }
    },
    _checkPatternArray: function(e, r) {
      if ("undefined" != typeof e) {
        e instanceof Array || (e = new Array(e));
        for (var t = 0; t < e.length; t++) {
          var s = utils.string.escapeRegExp(e[t]).replace(/\\\*/g, ".*"),
            i = new RegExp(s);
          if (i.test(r)) return !0;
        }
      }
      return !1;
    },
    _isIncludedUrl: function(e, r) {
      return null == e.headers.include
        ? !0
        : this._checkPatternArray(e.headers.include, r);
    },
    _isExcludedUrl: function(e, r) {
      return null == e.headers.exclude
        ? !1
        : this._checkPatternArray(e.headers.exclude, r);
    }
  }),
    (Userscript.prototype = {
      _parseHeaders: function() {
        (this.headers = this._parseHeadersToHashTable(this.text)),
          "undefined" != typeof this.headers.match &&
            ("undefined" == typeof this.headers.include
              ? (this.headers.include = this.headers.match)
              : this.headers.include.concat(this.headers.match));
      },
      _parseHeadersToHashTable: function(e) {
        for (var r = {}, t = e.split(/\n/), s = 0; s < t.length; s++) {
          var i = t[s];
          if (0 == i.indexOf("// ==/UserScript==")) break;
          var n = i.match(/\/\/ @(\S+)\s*(.*)/);
          if (null != n) {
            var a = n[1],
              c = n[2].replace(/\n|\r/g, "");
            switch (a) {
              case "include":
              case "exclude":
              case "match":
              case "require":
                (r[a] = r[a] || []), r[a].push(c);
                break;
              case "all-frames":
                r[a] = /^true/i.test(c);
                break;
              default:
                r[a] = c;
            }
          }
        }
        return r;
      }
    }),
    (module.exports = new UserscriptEngine()),
    (module.exports.UserscriptEngine = UserscriptEngine),
    (module.exports.Userscript = Userscript);
});
