// lib/plugins/utilities.js
ig.baked = true;
ig.module('plugins.utilities').defines(function() {
  randomRange = function(a, b) {
    return Math.random() * ((a < b) ? (b - a) : (a - b)) + ((a < b) ? a : b);
  };
  Number.prototype.quarticEaseOut = function(from_min, from_max, to_min, to_max) {
    var normalizedValue = this.map(from_min, from_max, 0, 1);
    var quarticValue = Math.pow(normalizedValue, 1 / 4);
    return quarticValue.map(0, 1, to_min, to_max);
  };
  Number.prototype.quarticEaseIn = function(from_min, from_max, to_min, to_max) {
    var normalizedValue = this.map(from_min, from_max, 0, 1);
    var quarticValue = Math.pow(normalizedValue, 4);
    return quarticValue.map(0, 1, to_min, to_max);
  };
  Number.prototype.quadraticEaseOut = function(from_min, from_max, to_min, to_max) {
    var normalizedValue = this.map(from_min, from_max, 0, 1);
    var quadraticValue = Math.pow(normalizedValue, 1 / 2);
    return quadraticValue.map(0, 1, to_min, to_max);
  };
  Number.prototype.quadraticEaseIn = function(from_min, from_max, to_min, to_max) {
    var normalizedValue = this.map(from_min, from_max, 0, 1);
    var quadraticValue = Math.pow(normalizedValue, 2);
    return quadraticValue.map(0, 1, to_min, to_max);
  };
});

