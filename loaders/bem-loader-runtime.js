'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function toCamelCase(str) {
  return str.replace(/(\-\w)/g, function (part) {
    return part[1].toUpperCase();
  });
}

var identity = function identity(arg) {
  return arg;
};

function addMods() {
  var _this = this;

  var classes = [this.toString()];

  for (var _len = arguments.length, mods = Array(_len), _key = 0; _key < _len; _key++) {
    mods[_key] = arguments[_key];
  }

  mods.forEach(function (_mod) {
    var mod = _mod.trim();
    if (mod === '') return;
    classes.push(_this.mods[mod]);
  });
  return classes.join(' ') + ' ';
}

exports.default = function () {
  var styles = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var obj = {};
  Object.keys(styles).forEach(function (className) {
    var mods = className.split('--');
    var elements = mods.shift().split('__');
    var path = obj;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var el = _step.value;

        if (!path.hasOwnProperty(el)) {
          path[el] = { mods: {} };
          path[toCamelCase(el)] = path[el];
          path[el].with = addMods.bind(path[el]);
        }
        path = path[el];
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (mods.length !== 0) {
      var modStr = mods.join(' ');
      path.mods[modStr] = styles[className];
    } else {
      path.toString = identity.bind(null, styles[className] + ' ');
    }
  });
  return obj;
};