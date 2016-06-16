var _ = require('lodash')

function zeroPad(val) {
  return _.padStart('' + val, 2, '0');
}

function asDate(val) {
  return val instanceof Date ? val : new Date(val);
}

function toArray(src) {
  return Array.prototype.slice.apply(src);
}

function getInput($element, withClass) {
  var allInputs = toArray($element.find('input'));
  return allInputs.filter(function(el) {
    var allClasses = toArray(el.classList);
    return allClasses.indexOf(withClass) > -1;
  })[0];
}

function isValid(value, min, max) {
  var asInt = parseInt(value + '');
  return !isNaN(asInt) && asInt >= min && asInt <= max;
}

function handleSet(min, max, newValue, oldValue, setter, focusOther) {
  if (newValue.length > 2) {
    newValue = newValue.substr(1);
  }
  if (!isValid(newValue, min, max)) {
    setter(isValid(oldValue) ? oldValue : min);
    return;
  }
  var focusNext = function() {
    if (focusOther) {
      focusOther.focus();
    }
  }
  var asInt = parseInt(newValue);
  if (newValue.length === 1) {
    var upper = max / 10;
    if (asInt >= upper) {
      setter('0' + newValue);
      focusNext();
    }
  } else {
    setter(asInt);
    focusNext();
  }
}

function makeStepperFunction(get, set, inc, after) {
  return function() {
    var current = get();
    set(inc(current));
    if (after) {
      after();
    }
  }
}

function addKeyUpHandler(el, keyCode, handler) {
  el.addEventListener('keyup', function(ev) {
    if (ev.keyCode === keyCode) {
      if (handler(ev)) {
        ev.preventDefault();
      }
    }
  })
}

function scopeEval($scope, toEval) {
  $scope.$eval(toEval);
  return true;
}

const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
function bindHoursArrowKeys($scope, $element) {
  var input = getInput($element, 'hours')
  addKeyUpHandler(input, KEY_ARROW_UP, function() {
    return scopeEval($scope, "stepHours(1)");
  });
  addKeyUpHandler(input, KEY_ARROW_DOWN, function() {
    return scopeEval($scope, "stepHours(-1)");
  });
}

function bindMinutesArrowKeys($scope, $element) {
  var input = getInput($element, 'minutes')
  addKeyUpHandler(input, KEY_ARROW_UP, function() {
    return scopeEval($scope, "stepMinutes(1)");
  })
  addKeyUpHandler(input, KEY_ARROW_DOWN, function() {
    return scopeEval($scope, "stepMinutes(-1)");
  })
}

function bindArrowKeys($scope, $element) {
  bindHoursArrowKeys($scope, $element);
  bindMinutesArrowKeys($scope, $element);
}

function timeInputDirective() {
  return {
    template: require('./template.html'),
    restrict: 'E',
    link: function($scope, $element, $attrs) {
      var modelBind = $attrs['ngModel'];
      if (!modelBind) {
        console.log('time-input has no ngModel set; falling back on "value"');
        modelBind = 'value';
        $scope.value = new Date();
      }
      bindArrowKeys($scope, $element);
      function get() {
        var val = _.get($scope, modelBind);
        return asDate(val);
      }
      function set(val) {
        var toSet = asDate(val);
        _.set($scope, modelBind, val);
      }
      function setInputsFor(dateVal) {
        if (dateVal instanceof Date) {
          $scope.hours = zeroPad(dateVal.getHours());
          $scope.minutes = zeroPad(dateVal.getMinutes());
        }
      }
      $scope.$watch(modelBind, function(newValue, oldValue) {
        setInputsFor(newValue);
      });
      function trySetWith(modifierFunc) {
        const currentVal = get();
        if (!currentVal) {
          return;
        }
        set(modifierFunc(currentVal));
        setInputsFor($scope[modelBind]);
      }
      function setHours(val) {
        trySetWith(function(currentVal) {
          return currentVal.setHours(parseInt(val));
        });
      }
      function setMinutes(val) {
        trySetWith(function(currentVal) {
          console.log('setMinutes: current value: ' + currentVal);
          console.log('setMinutes: will set minutes to ' + parseInt(val));
          return currentVal.setMinutes(parseInt(val));
        });
      }
      var suppressSelect = false;
      $scope.$watch('hours', function(newValue, oldValue) {
        handleSet(0, 23, newValue, oldValue, setHours, suppressSelect ? null : getInput($element, 'minutes'));
        suppressSelect = false;
      })
      $scope.$watch('minutes', function(newValue, oldValue) {
        handleSet(0, 59, newValue, oldValue, setMinutes);
      });
      function suppress() {
        suppressSelect = true;
      }

      $scope.stepHours = function(howMuch) {
        var current = get();
        if (current) {
          setHours(current.getHours() + howMuch);
        }
      };
      $scope.stepMinutes = function(howMuch) {
        var current = get();
        if (current) {
          setMinutes(current.getMinutes() + howMuch);
        }
      }
    }
  }
}

module.exports = function(mod) {
  mod.directive('timeInput', timeInputDirective);
}
