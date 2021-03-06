function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

import React, { useContext, useReducer, useEffect, createContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
/*!
 * paypal-js v1.0.3 (2020-10-14T17:44:15.504Z)
 * Copyright 2020-present, PayPal, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @this {Promise}
 */

function finallyConstructor(callback) {
  var constructor = this.constructor;
  return this.then(function (value) {
    // @ts-ignore
    return constructor.resolve(callback()).then(function () {
      return value;
    });
  }, function (reason) {
    // @ts-ignore
    return constructor.resolve(callback()).then(function () {
      // @ts-ignore
      return constructor.reject(reason);
    });
  });
} // Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())


var setTimeoutFunc = setTimeout;

function isArray(x) {
  return Boolean(x && typeof x.length !== 'undefined');
}

function noop() {} // Polyfill for Function.prototype.bind


function bind(fn, thisArg) {
  return function () {
    fn.apply(thisArg, arguments);
  };
}
/**
 * @constructor
 * @param {Function} fn
 */


function Promise(fn) {
  if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
  if (typeof fn !== 'function') throw new TypeError('not a function');
  /** @type {!number} */

  this._state = 0;
  /** @type {!boolean} */

  this._handled = false;
  /** @type {Promise|undefined} */

  this._value = undefined;
  /** @type {!Array<!Function>} */

  this._deferreds = [];
  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }

  if (self._state === 0) {
    self._deferreds.push(deferred);

    return;
  }

  self._handled = true;

  Promise._immediateFn(function () {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;

    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }

    var ret;

    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }

    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');

    if (newValue && (_typeof(newValue) === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;

      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === 'function') {
        doResolve(bind(then, newValue), self);
        return;
      }
    }

    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function () {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }

  self._deferreds = null;
}
/**
 * @constructor
 */


function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}
/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */


function doResolve(fn, self) {
  var done = false;

  try {
    fn(function (value) {
      if (done) return;
      done = true;
      resolve(self, value);
    }, function (reason) {
      if (done) return;
      done = true;
      reject(self, reason);
    });
  } catch (ex) {
    if (done) return;
    done = true;
    reject(self, ex);
  }
}

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function (onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);
  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype['finally'] = finallyConstructor;

Promise.all = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.all accepts an array'));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (_typeof(val) === 'object' || typeof val === 'function')) {
          var then = val.then;

          if (typeof then === 'function') {
            then.call(val, function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }

        args[i] = val;

        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function (value) {
  if (value && _typeof(value) === 'object' && value.constructor === Promise) {
    return value;
  }

  return new Promise(function (resolve) {
    resolve(value);
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (arr) {
  return new Promise(function (resolve, reject) {
    if (!isArray(arr)) {
      return reject(new TypeError('Promise.race accepts an array'));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
}; // Use polyfill for setImmediate for performance gains


Promise._immediateFn = // @ts-ignore
typeof setImmediate === 'function' && function (fn) {
  // @ts-ignore
  setImmediate(fn);
} || function (fn) {
  setTimeoutFunc(fn, 0);
};

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
  if (typeof console !== 'undefined' && console) {
    console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
  }
};

function findScript(url, dataAttributes) {
  var currentScript = document.querySelector("script[src=\"".concat(url, "\"]"));
  if (!currentScript) return null;
  var nextScript = createScriptElement(url, dataAttributes); // check if the new script has the same number of data attributes

  if (objectSize(currentScript.dataset) !== objectSize(nextScript.dataset)) {
    return null;
  }

  var isExactMatch = true; // check if the data attribute values are the same

  forEachObjectKey(currentScript.dataset, function (key) {
    if (currentScript.dataset[key] !== nextScript.dataset[key]) {
      isExactMatch = false;
    }
  });
  return isExactMatch ? currentScript : null;
}

function insertScriptElement(_ref) {
  var url = _ref.url,
      dataAttributes = _ref.dataAttributes,
      onSuccess = _ref.onSuccess,
      onError = _ref.onError;
  var newScript = createScriptElement(url, dataAttributes);
  newScript.onerror = onError;
  newScript.onload = onSuccess;
  document.head.insertBefore(newScript, document.head.firstElementChild);
}

function processOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var processedOptions = {
    queryParams: {},
    dataAttributes: {}
  };
  forEachObjectKey(options, function (key) {
    if (key.substring(0, 5) === 'data-') {
      processedOptions.dataAttributes[key] = options[key];
    } else {
      processedOptions.queryParams[key] = options[key];
    }
  });
  var queryParams = processedOptions.queryParams,
      dataAttributes = processedOptions.dataAttributes;
  return {
    queryString: objectToQueryString(queryParams),
    dataAttributes: dataAttributes
  };
}

function objectToQueryString(params) {
  var queryString = '';
  forEachObjectKey(params, function (key) {
    if (queryString.length !== 0) queryString += '&';
    queryString += key + '=' + params[key];
  });
  return queryString;
}

function createScriptElement(url) {
  var dataAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var newScript = document.createElement('script');
  newScript.src = url;
  forEachObjectKey(dataAttributes, function (key) {
    newScript.setAttribute(key, dataAttributes[key]);
  });
  return newScript;
} // uses es3 to avoid requiring polyfills for Array.prototype.forEach and Object.keys


function forEachObjectKey(obj, callback) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      callback(key);
    }
  }
}

function objectSize(obj) {
  var size = 0;
  forEachObjectKey(obj, function () {
    return size++;
  });
  return size;
}

var SDK_BASE_URL = 'https://www.paypal.com/sdk/js';
var loadingPromise;
var isLoading = false;

function loadScript(options) {
  // resolve with the existing promise when the script is loading
  if (isLoading) return loadingPromise;
  return loadingPromise = new Promise(function (resolve, reject) {
    // resolve with null when running in Node
    if (typeof window === 'undefined') return resolve(null);

    var _processOptions = processOptions(options),
        queryString = _processOptions.queryString,
        dataAttributes = _processOptions.dataAttributes;

    var url = "".concat(SDK_BASE_URL, "?").concat(queryString); // resolve with the existing global paypal object when a script with the same src already exists

    if (findScript(url, dataAttributes) && window.paypal) return resolve(window.paypal);
    isLoading = true;
    insertScriptElement({
      url: url,
      dataAttributes: dataAttributes,
      onSuccess: function onSuccess() {
        isLoading = false;
        if (window.paypal) return resolve(window.paypal);
        return reject(new Error('The window.paypal global variable is not available.'));
      },
      onError: function onError() {
        isLoading = false;
        return reject(new Error("The script \"".concat(url, "\" didn't load correctly.")));
      }
    });
  });
} // replaced with the package.json version at build time


var SCRIPT_LOADING_STATE = {
  PENDING: "pending",
  REJECTED: "rejected",
  RESOLVED: "resolved"
};
var ScriptContext = /*#__PURE__*/createContext();
var ScriptDispatchContext = /*#__PURE__*/createContext();

function scriptReducer(state, action) {
  switch (action.type) {
    case "setLoadingStatus":
      return {
        options: _objectSpread({}, state.options),
        loadingStatus: action.value
      };

    case "resetOptions":
      return {
        loadingStatus: SCRIPT_LOADING_STATE.PENDING,
        options: action.value
      };

    default:
      {
        throw new Error("Unhandled action type: ".concat(action.type));
      }
  }
}

function usePayPalScriptReducer() {
  var scriptContext = useContext(ScriptContext);
  var dispatchContext = useContext(ScriptDispatchContext);

  if (scriptContext === undefined || dispatchContext === undefined) {
    throw new Error("useScriptReducer must be used within a ScriptProvider");
  }

  var loadingStatus = scriptContext.loadingStatus,
      restScriptContext = _objectWithoutProperties(scriptContext, ["loadingStatus"]);

  var derivedStatusContext = _objectSpread(_objectSpread({}, restScriptContext), {}, {
    isPending: loadingStatus === SCRIPT_LOADING_STATE.PENDING,
    isResolved: loadingStatus === SCRIPT_LOADING_STATE.RESOLVED,
    isRejected: loadingStatus === SCRIPT_LOADING_STATE.REJECTED
  });

  return [derivedStatusContext, dispatchContext];
}

function PayPalScriptProvider(_ref2) {
  var options = _ref2.options,
      children = _ref2.children;
  var initialState = {
    options: options,
    loadingStatus: SCRIPT_LOADING_STATE.PENDING
  };

  var _useReducer = useReducer(scriptReducer, initialState),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  useEffect(function () {
    if (state.loadingStatus !== SCRIPT_LOADING_STATE.PENDING) return;
    var isSubscribed = true;
    loadScript(state.options).then(function () {
      if (isSubscribed) {
        dispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.RESOLVED
        });
      }
    })["catch"](function () {
      if (isSubscribed) {
        dispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.REJECTED
        });
      }
    });
    return function () {
      isSubscribed = false;
    };
  });
  return /*#__PURE__*/React.createElement(ScriptContext.Provider, {
    value: state
  }, /*#__PURE__*/React.createElement(ScriptDispatchContext.Provider, {
    value: dispatch
  }, children));
}

PayPalScriptProvider.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.exact({
    "buyer-country": PropTypes.string,
    "client-id": PropTypes.string.isRequired,
    commit: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    components: PropTypes.string,
    currency: PropTypes.string,
    "data-client-token": PropTypes.string,
    "data-csp-nonce": PropTypes.string,
    "data-order-id": PropTypes.string,
    "data-page-type": PropTypes.string,
    "data-partner-attribution-id": PropTypes.string,
    debug: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    "disable-funding": PropTypes.string,
    "integration-date": PropTypes.string,
    intent: PropTypes.string,
    locale: PropTypes.string,
    "merchant-id": PropTypes.string,
    vault: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  })
};
/**
 * This `<PayPalButtons />` component renders the [Smart Payment Buttons](https://developer.paypal.com/docs/business/javascript-sdk/javascript-sdk-reference/#buttons).
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * Use props for customizing your buttons. For example, here's how you would use the `style` and `createOrder` options:
 *
 * ```jsx
 *     <PayPalButtons style={{ layout: "vertical" }} createOrder={(data, actions) => {}} />
 * ```
 */

function PayPalButtons(props) {
  var _usePayPalScriptReduc = usePayPalScriptReducer(),
      _usePayPalScriptReduc2 = _slicedToArray(_usePayPalScriptReduc, 1),
      _usePayPalScriptReduc3 = _usePayPalScriptReduc2[0],
      isResolved = _usePayPalScriptReduc3.isResolved,
      options = _usePayPalScriptReduc3.options;

  var buttonsContainerRef = useRef(null);
  var buttons = useRef(null);

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      setErrorState = _useState2[1];

  useEffect(function () {
    var cleanup = function cleanup() {
      if (buttons.current) {
        buttons.current.close();
      }
    };

    if (!isResolved) {
      return cleanup;
    }

    if (!hasValidGlobalStateForButtons(options, setErrorState)) {
      return cleanup;
    }

    buttons.current = window.paypal.Buttons(_objectSpread({}, props));

    if (!buttons.current.isEligible()) {
      return cleanup;
    }

    buttons.current.render(buttonsContainerRef.current)["catch"](function (err) {
      console.error("Failed to render <PayPalButtons /> component. ".concat(err));
    });
    return cleanup;
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: buttonsContainerRef
  });
}

function hasValidGlobalStateForButtons(_ref3, setErrorState) {
  var _ref3$components = _ref3.components,
      components = _ref3$components === void 0 ? "" : _ref3$components;

  if (typeof window.paypal.Buttons !== "undefined") {
    return true;
  }

  var errorMessage = "Unable to render <PayPalButtons /> because window.paypal.Buttons is undefined."; // the JS SDK includes the Buttons component by default when no 'components' are specified.
  // The 'buttons' component must be included in the 'components' list when using it with other components.

  if (components.length && !components.includes("buttons")) {
    var expectedComponents = "".concat(components, ",buttons");
    errorMessage += "\nTo fix the issue, add 'buttons' to the list of components passed to the parent PayPalScriptProvider:" + "\n`<PayPalScriptProvider options={{ components: '".concat(expectedComponents, "'}}>`.");
  }

  setErrorState(function () {
    throw new Error(errorMessage);
  });
  return false;
}

PayPalButtons.propTypes = {
  /**
   * Sets up the transaction. Called when the buyer clicks the PayPal button.
   */
  createOrder: PropTypes.func,

  /**
   * Deprecated, replaced by `createSubscription`.
   */
  createBillingAgreement: PropTypes.func,

  /**
   * Sets up a subscription. Called when the buyer clicks the PayPal button.
   */
  createSubscription: PropTypes.func,

  /**
   * The individual button to render. Use the `FUNDING` constant exported by this library to set this value.
   * View the [list of available funding sources](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/#funding-sources) for more info.
   */
  fundingSource: PropTypes.string,

  /**
   * [Styling options](https://developer.paypal.com/docs/business/checkout/reference/style-guide/#customize-the-payment-buttons) for customizing layout, color, shape, and labels.
   */
  style: PropTypes.exact({
    color: PropTypes.string,
    height: PropTypes.number,
    label: PropTypes.string,
    layout: PropTypes.string,
    shape: PropTypes.string,
    tagline: PropTypes.bool
  }),

  /**
   * The possible values for shippingPreference are:
   *
   *    * `"NO_SHIPPING"`- Redact shipping address fields from the PayPal pages.
   *    * `"GET_FROM_FILE"`- Use the buyer-selected shipping address.
   *    * `"SET_PROVIDED_ADDRESS"`- Use the merchant-provided address.
   */
  shippingPreference: PropTypes.oneOf(["GET_FROM_FILE", "NO_SHIPPING", "SET_PROVIDED_ADDRESS"]),

  /**
   * Finalizes the transaction. Often used to show the buyer a [confirmation page](https://developer.paypal.com/docs/checkout/integration-features/confirmation-page/).
   */
  onApprove: PropTypes.func,

  /**
   * Called when the buyer cancels the transaction.
   * Often used to show the buyer a [cancellation page](https://developer.paypal.com/docs/business/checkout/add-capabilities/buyer-experience/#show-a-cancellation-page).
   */
  onCancel: PropTypes.func,

  /**
   * Called when the button is clicked. Often used for [validation](https://developer.paypal.com/docs/checkout/integration-features/validation/).
   */
  onClick: PropTypes.func,

  /**
   * Catch all for errors preventing buyer checkout.
   * Often used to show the buyer an [error page](https://developer.paypal.com/docs/checkout/integration-features/handle-errors/).
   */
  onError: PropTypes.func,

  /**
   * Called when the button first renders.
   */
  onInit: PropTypes.func,

  /**
   * Called when the buyer changes their shipping address on PayPal.
   */
  onShippingChange: PropTypes.func
};
PayPalButtons.defaultProps = {
  style: {},
  shippingPreference: "GET_FROM_FILE"
};
/**
 * The `<PayPalMarks />` component is used for conditionally rendering different payment options using radio buttons.
 * The [Display PayPal Buttons with other Payment Methods guide](https://developer.paypal.com/docs/business/checkout/add-capabilities/buyer-experience/#display-paypal-buttons-with-other-payment-methods) describes this style of integration in detail.
 * It relies on the `<PayPalScriptProvider />` parent component for managing state related to loading the JS SDK script.
 *
 * ```jsx
 *     <PayPalMarks />
 * ```
 *
 * This component can also be configured to use a single funding source similar to the [standalone buttons](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/) approach.
 * A `FUNDING` object is exported by this library which has a key for every available funding source option.
 *
 * ```js
 *     import { FUNDING } from '@paypal/react-paypal-js'
 * ```
 *
 * Use this `FUNDING` constant to set the `fundingSource` prop.
 *
 * ```jsx
 *     <PayPalMarks fundingSource={FUNDING.PAYPAL}/>
 * ```
 */

function PayPalMarks(props) {
  var _usePayPalScriptReduc4 = usePayPalScriptReducer(),
      _usePayPalScriptReduc5 = _slicedToArray(_usePayPalScriptReduc4, 1),
      _usePayPalScriptReduc6 = _usePayPalScriptReduc5[0],
      isResolved = _usePayPalScriptReduc6.isResolved,
      options = _usePayPalScriptReduc6.options;

  var markContainerRef = useRef(null);
  var mark = useRef(null);

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      setErrorState = _useState4[1];

  useEffect(function () {
    if (!isResolved || mark.current) {
      return;
    }

    if (!hasValidStateForMarks(options, setErrorState)) {
      return;
    }

    mark.current = window.paypal.Marks(_objectSpread({}, props));

    if (!mark.current.isEligible()) {
      return;
    }

    mark.current.render(markContainerRef.current)["catch"](function (err) {
      console.error("Failed to render <PayPalMarks /> component. ".concat(err));
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: markContainerRef
  });
}

function hasValidStateForMarks(_ref4, setErrorState) {
  var _ref4$components = _ref4.components,
      components = _ref4$components === void 0 ? "" : _ref4$components;

  if (typeof window.paypal.Marks !== "undefined") {
    return true;
  }

  var errorMessage = "Unable to render <PayPalMarks /> because window.paypal.Marks is undefined."; // the JS SDK does not load the Marks component by default. It must be passed into the "components" query parameter.

  if (!components.includes("marks")) {
    var expectedComponents = components ? "".concat(components, ",marks") : "marks";
    errorMessage += "\nTo fix the issue, add 'marks' to the list of components passed to the parent PayPalScriptProvider:" + "\n`<PayPalScriptProvider options={{ components: '".concat(expectedComponents, "'}}>`.");
  }

  setErrorState(function () {
    throw new Error(errorMessage);
  });
  return false;
}

PayPalMarks.propTypes = {
  /**
   * The individual mark to render. Use the `FUNDING` constant exported by this library to set this value.
   * View the [list of available funding sources](https://developer.paypal.com/docs/business/checkout/configure-payments/standalone-buttons/#funding-sources) for more info.
   */
  fundingSource: PropTypes.string
};

function PayPalMessages(props) {
  var _usePayPalScriptReduc7 = usePayPalScriptReducer(),
      _usePayPalScriptReduc8 = _slicedToArray(_usePayPalScriptReduc7, 1),
      isResolved = _usePayPalScriptReduc8[0].isResolved;

  var messagesContainerRef = useRef(null);
  var messages = useRef(null);
  useEffect(function () {
    if (!isResolved) {
      return;
    }

    messages.current = window.paypal.Messages(_objectSpread({}, props));
    messages.current.render(messagesContainerRef.current)["catch"](function (err) {
      console.error("Failed to render <PayPalMessages /> component. ".concat(err));
    });
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: messagesContainerRef
  });
}

var FUNDING = {
  PAYPAL: 'paypal',
  VENMO: 'venmo',
  ITAU: 'itau',
  CREDIT: 'credit',
  PAYLATER: 'paylater',
  CARD: 'card',
  IDEAL: 'ideal',
  SEPA: 'sepa',
  BANCONTACT: 'bancontact',
  GIROPAY: 'giropay',
  SOFORT: 'sofort',
  EPS: 'eps',
  MYBANK: 'mybank',
  P24: 'p24',
  VERKKOPANKKI: 'verkkopankki',
  PAYU: 'payu',
  BLIK: 'blik',
  TRUSTLY: 'trustly',
  ZIMPLER: 'zimpler',
  MAXIMA: 'maxima',
  OXXO: 'oxxo',
  BOLETO: 'boleto',
  WECHATPAY: 'wechatpay',
  MERCADOPAGO: 'mercadopago'
};
export { FUNDING, PayPalButtons, PayPalMarks, PayPalMessages, PayPalScriptProvider, usePayPalScriptReducer };
