'use strict';

var util = require('util');

var istanbul = require('istanbul');

var esprima = require('esprima');
var reactTools = require('react-tools');

function Instrumenter(opt){
  istanbul.Instrumenter.call(this, opt);
}

util.inherits(Instrumenter, istanbul.Instrumenter);

Instrumenter.prototype._transform = function (content) {
  var transformed = reactTools.transformWithDetails(content, {
    sourceMap: true,
    harmony: true
  });

  var program = esprima.parse(transformed.code, {
    loc: true
  });

  return program;
};

Instrumenter.prototype.instrument = function (code, filename, callback) {
  var program = this._transform(code);

  try {
    callback(void 0, this.instrumentASTSync(program, filename, code));
  } catch (exception) {
    callback(exception);
  }
};

Instrumenter.prototype.instrumentSync = function (code, filename) {
  var program = this._transform(code);

  return this.instrumentASTSync(program, filename, code);
};

module.exports = {
  Instrumenter: Instrumenter
};
