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
          return currentVal.setHours(parseInt(val))
        });
      }
      function setMinutes(val) {
        trySetWith(function(currentVal) {
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
