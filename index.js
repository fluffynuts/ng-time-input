(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function timeInputDirective() {
  return {
    template: require('./template.html'),
    restrict: 'E',
    link: function($scope, $element, $attrs) {
    }
  }
}

module.exports = function(mod) {
  mod.directive('timeInput', timeInputDirective);
}
},{"./template.html":3}],2:[function(require,module,exports){
const register = require('./directive');
const mod = angular.module('ngTimeInput', []);
register(mod);

},{"./directive":1}],3:[function(require,module,exports){
module.exports = "<input type=\"text\"/>:<input type=\"text\"/>";

},{}]},{},[2]);
