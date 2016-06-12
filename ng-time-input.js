(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function zeroPad(val) {
  val = '' + val;
  while (val.length < 2) {
    val = '0' + val;
  }
  return val;
}

function toArray(src) {
  return Array.prototype.slice.apply(src);
}

function getInput($element, withClass) {
  const allInputs = toArray($element.find('input'));
  return allInputs.filter(function(el) {
    const allClasses = toArray(el.classList);
    return allClasses.indexOf(withClass) > -1;
  })[0];
}

function isValid(value, min, max) {
  const asInt = parseInt(value + '');
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
  const focusNext = function() {
    if (focusOther) {
      focusOther.focus();
    }
  }
  const asInt = parseInt(newValue);
  if (newValue.length === 1) {
    const upper = max / 10;
    if (asInt >= upper) {
      setter('0' + newValue);
      focusNext();
    }
  } else {
    setter(asInt);
    focusNext();
  }
}

const steppers = {
  incrementHours: function(v) {
    return v.setHours(v.getHours() + 1);
  },
  decrementHours: function(v) {
    return v.setHours(v.getHours() - 1);
  },
  incrementMinutes: function(v) {
    return v.setMinutes(v.getMinutes() + 1);
  },
  decrementMinutes: function(v) {
    return v.setMinutes(v.getMinutes() - 1);
  }
};

function makeStepperFunction(get, set, inc, after) {
  return function() {
    const current = get();
    set(inc(current));
    if (after) {
      after();
    }
  }
}

function timeInputDirective() {
  return {
    template: require('./template.html'),
    restrict: 'E',
    link: function($scope, $element, $attrs) {
      let modelBind = $attrs['ngModel']
      if (!modelBind) {
        console.log('time-input has no ngModel set; falling back on "value"');
        modelBind = 'value';
        $scope.value = new Date();
      }
      function get() {
        return $scope[modelBind];
      }
      function set(val) {
        $scope[modelBind] = val instanceof Date ? val : new Date(val);
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
      const hoursInput = getInput($element, 'hours');
      const minutesInput = getInput($element, 'minutes');
      function setHours(val) {
        set(get().setHours(parseInt(val)));
        setInputsFor($scope[modelBind]);
      }
      function setMinutes(val) {
        set(get().setMinutes(parseInt(val)));
        setInputsFor($scope[modelBind]);
      }
      $scope.$watch('hours', function(newValue, oldValue) {
        handleSet(0, 23, newValue, oldValue, setHours, minutesInput);
      })
      $scope.$watch('minutes', function(newValue, oldValue) {
        handleSet(0, 59, newValue, oldValue, setMinutes);
      });
      function blurAll() {
        hoursInput.blur();
        minutesInput.blur();
      }

      $scope.incrementHours = makeStepperFunction(get, set, steppers.incrementHours, blurAll);
      $scope.decrementHours = makeStepperFunction(get, set, steppers.decrementHours);
      $scope.incrementMinutes = makeStepperFunction(get, set, steppers.incrementMinutes);
      $scope.decrementMinutes = makeStepperFunction(get, set, steppers.decrementMinutes);
    }
  }
}

module.exports = function(mod) {
  mod.directive('timeInput', timeInputDirective);
}
},{"./template.html":3}],2:[function(require,module,exports){
const register = require('./directive');
const mod = angular.module('ngTimeInput', ['ng-scroll']);
register(mod);

},{"./directive":1}],3:[function(require,module,exports){
module.exports = "<div class=\"time-input\">\r\n<input \r\n  type=\"text\" \r\n  class=\"hours\" \r\n  data-ng-model=\"hours\"\r\n  onfocus=\"this.select()\"\r\n  data-ng-scroll-up=\"incrementHours()\"\r\n  data-ng-scroll-down=\"decrementHours()\"\r\n  onmouseup=\"return false;\"/>:<input \r\n                                 type=\"text\" \r\n                                 class=\"minutes\" \r\n                                 data-ng-model=\"minutes\"\r\n                                 data-ng-focus=\"minutesFocused()\"\r\n                                 onfocus=\"this.select()\"\r\n                                 data-ng-scroll-up=\"incrementMinutes()\"\r\n                                 data-ng-scroll-down=\"decrementMinutes()\"\r\n                                 onmouseup=\"return false;\"/>\r\n</div>";

},{}]},{},[2]);
