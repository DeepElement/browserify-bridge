var path = require('path'),
  async = require('async'),
  fs = require('fs');

var _exportsInject = 'function a(e,t,n){var r=e,i=t.split("."),s;while(i.length>0){s=i.shift();if(!r[s]){if(i.length>0)r[s]={};else{r[s]=n}}r=r[s]}};';

String.prototype.replaceAll = function(search, replace) {
  if (replace === undefined) {
    return this.toString();
  }
  return this.split(search).join(replace);
};

var _constructor = function(options) {
  this._sources = options.sources;
  this._relativeApiRoot = options.relativeApiRoot;

  // package.json support
  this._package = options.package;
};

_constructor.prototype.generate = function(callback) {
  var that = this;
  var result = _exportsInject + "\n\n";

  if (that._package) {
    var packageDef = require(that._package);
    for (var depKey in packageDef.dependencies)
      result += 'exports["' + depKey + '"]=require("' + depKey + '");\n';
    result += "\n";
  }

  if (that._sources) {
    that._sources.forEach(function(item) {
      var modulePath = item;

      if (that._relativeApiRoot)
        modulePath = path.relative(that._relativeApiRoot, modulePath);

      var moduleFullName = path.basename(modulePath);
      var moduleFullNameExt = path.extname(moduleFullName);
      var moduleApiName = moduleFullName.slice(0, -moduleFullNameExt.length);
      var moduleApiKey = modulePath.slice(0, -moduleFullNameExt.length);
      moduleApiKey = moduleApiKey.replaceAll(path.sep, '.');

      if (moduleApiKey.indexOf('.') == 0)
        moduleApiKey = moduleApiKey.substr(1);
      result += 'a(exports,\'' + moduleApiKey + '\', require(\'' + item.replace(/\//g, path.sep) + '\')) \n';
    });
    result += "\n";
  }

  return result;
};

_constructor.prototype.exportToFile = function(path, callback) {
  var content = this.generate();
  fs.writeFile(path, content, callback);
};

_constructor.prototype.export = function(callback) {
  var content = this.generate();
  return callback(null, content);
};

// export for profit
"object" === typeof exports ? module.exports = _constructor : "function" === typeof define && define.amd ? define(function() {
  return _constructor;
}) : this["browserify-bridge"] = _constructor;
