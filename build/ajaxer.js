(function () {
'use strict';

/* eslint no-nested-ternary: 0 */
/* eslint no-negated-condition: 0 */
var global$1 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _ref = {};
var hasOwnProperty = _ref.hasOwnProperty;
var toString = _ref.toString;

var whiteSpace = /^\s*|\s*$/g;
function toStringTag(value) {
  return toString.call(value).slice(8, -1);
}

var isArray = Array.isArray || function (value) {
  return toStringTag(value) === 'Array';
};

function isFunction(value) {
  return typeof value === 'function' || toStringTag(value) === 'Function';
}

function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) && ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' || isFunction(value));
}

function isPrimitive(value) {
  return value === null || /^(number|string|boolean|symbol|undefined)$/.test(typeof value === 'undefined' ? 'undefined' : _typeof(value));
}

function isString(value) {
  return toStringTag(value) === 'String';
}

function assign(target) {
  for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    objects[_key - 1] = arguments[_key];
  }

  iterate(objects, function (source) {
    iterate(source, function (value, key) {
      target[key] = value;
    });
  });

  return target;
}

function iterate(object, callback) {
  var array = isArray(object);

  var iterated = 0;

  var _ref2 = object || {},
      length = _ref2.length;

  for (var key in object) {
    if (hasOwnProperty.call(object, key)) {
      if (array && iterated++ >= length) {
        break;
      }

      callback(object[key], array ? +key : key, object);
    }
  }
}

function map(object, callback) {
  var newObject = isArray(object) ? [] : {};

  iterate(object, function (value, key) {
    newObject[key] = callback(value, key, object);
  });

  return newObject;
}

function trim(string) {
  return string.replace(whiteSpace, '');
}

function replaceString(string, stringToReplace, replacement) {
  return string.split(stringToReplace).join(replacement);
}

function deepClone(object) {
  if (isPrimitive(object) || isFunction(object)) {
    return object;
  }

  var clone = isArray(object) ? [] : {};

  iterate(object, function (value, key) {
    clone[key] = deepClone(value);
  });

  return clone;
}

function deepAssign(target) {
  for (var _len2 = arguments.length, objects = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    objects[_key2 - 1] = arguments[_key2];
  }

  iterate(objects, function (object) {
    iterate(object, function (object, key) {
      if (isPrimitive(object) || !hasOwnProperty.call(target, key)) {
        target[key] = deepClone(object);

        return;
      }

      if (!isPrimitive(target[key])) {
        deepAssign(target[key], object);
      }
    });
  });

  return target;
}

function hasOwn(object, property) {
  return hasOwnProperty.call(object, property);
}

/**
 * @callback onFulfilledOrRejected
 * @public
 * @param {*} value - Promise value.
 * @param {Boolean} success - If the previous promise is fulfilled it's true and false if rejected.
 */

/**
 * @callback onRejected
 * @public
 * @param {Error|*} err - Promise error.
 */

/**
 * @callback onFulfilled
 * @public
 * @param {*} value - Promise value.
 */

var secret = {};
var iterator = global$1.Symbol ? Symbol.iterator : Math.random().toString(36);

/**
 * @class Promise
 * @public
 * @param {Function} executor - Function that takes two arguments: resolve and reject functions.
 * Call the resolve function when you need to fulfill the promise and call the reject one
 * when you need to reject it.
 * @returns {Promise} Instance of Promise.
 * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * @description Class with almost identical API to
 * [ES6 Promise]{@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * There is a couple differences: set Promise.onError to a function with which you want to
 * subscribe to a promise error and set Promise.onUnhandledRejection to a function with which
 * you want to subscribe to an unhandled error
 * (defaults to console.error.bind(console, '%s %o', 'Uncaught (in promise)')).
 */

var Promise$1 = function () {
  function Promise(executor) {
    classCallCheck(this, Promise);

    if (!isFunction(executor)) {
      throw new TypeError('Promise resolver ' + {}.toString.call(executor) + ' is not a function');
    }

    var hiddenStatus = void 0;
    var hiddenValue = void 0;

    var onFulfill = [];
    var onReject = [];
    var realPromise = this;
    var hiddenPromise = {
      handled: false,
      get status() {
        return hiddenStatus;
      },
      set status(value) {
        hiddenStatus = value;
        realPromise.status = value;
      },
      get value() {
        return hiddenValue;
      },
      set value(val) {
        hiddenValue = val;
        realPromise.value = val;
      }
    };

    hiddenPromise.status = 'pending';
    hiddenPromise.value = undefined;

    Object.defineProperties(this.$$ = {}, {
      handled: {
        get: function get$$1() {
          return hiddenPromise.handled;
        },
        set: function set$$1(key) {
          if (key === secret) {
            hiddenPromise.handled = true;
          }
        }
      },
      handle: {
        value: function value(status, f, resolve, reject, key) {
          if (key === secret) {
            var proxy = null;

            if (isFunction(f)) {
              proxy = function proxy(value) {
                try {
                  resolve(f(value));
                } catch (err) {
                  reject(err);
                }
              };
            }

            if (status === 'resolve') {
              onFulfill.push(proxy || function (value) {
                return resolve(value);
              });
            } else if (status === 'reject') {
              onReject.push(proxy || function (err) {
                return reject(err);
              });
            }
          }
        }
      },
      status: {
        get: function get$$1() {
          return hiddenPromise.status;
        }
      },
      value: {
        get: function get$$1() {
          return hiddenPromise.value;
        }
      }
    });

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }

    function reject(err) {
      if (hiddenPromise.status === 'pending') {
        (function () {
          hiddenPromise.status = 'rejected';
          hiddenPromise.value = err;

          for (var i = 0, length = onReject.length; i < length; i++) {
            hiddenPromise.handled = true;

            onReject[i](err);
          }

          var onUnhandledRejection = Promise.onUnhandledRejection,
              onError = Promise.onError;


          if (isFunction(onError)) {
            onError(err);
          }

          setTimeout(function () {
            if (!hiddenPromise.handled && isFunction(onUnhandledRejection)) {
              onUnhandledRejection(err);
            }
          }, 1);
        })();
      }
    }

    function resolve(value) {
      if (hiddenPromise.status === 'pending') {
        if (value && isFunction(value.then)) {
          return value.then(function (value) {
            resolve(value);
          }, function (err) {
            reject(err);
          });
        }

        hiddenPromise.status = 'fulfilled';
        hiddenPromise.value = value;

        for (var i = 0, length = onFulfill.length; i < length; i++) {
          hiddenPromise.handled = true;

          onFulfill[i](value);
        }
      }
    }
  }

  /**
   * @method Promise.all
   * @param {(Array|Iterable).<Promise|*>} iterable - Iterable object (like array) of promises
   * or any values.
   * @returns {Promise} New instance of Promise.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
   */


  createClass(Promise, [{
    key: 'abort',
    value: function abort() {}

    /**
     * @method Promise#catch
     * @param {onRejected} onRejected - onRejected callback.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
     */

  }, {
    key: 'catch',
    value: function _catch(onRejected) {
      return this.then(null, onRejected);
    }

    /**
     * @method Promise#finally
     * @public
     * @param {onFulfilledOrRejected} onFulfilledOrRejected - onFulfilledOrRejected callback.
     * @returns {Promise}
     * @description Method for catching both fulfilled and rejected promises.
     *
     * @example
     * spinner.show();
     * fetchData()
     *   .then((data) => {
     *     // do something with data
     *   })
     *   .catch((err) => {
     *     // handle error somehow
     *   })
     *   .finally(() => {
     *     spinner.hide();
     *   });
     */

  }, {
    key: 'finally',
    value: function _finally(onFulfilledOrRejected) {
      var isFunc = isFunction(onFulfilledOrRejected);

      return this.then(function (value) {
        return Promise.resolve(isFunc ? onFulfilledOrRejected(value, true) : 0).then(function () {
          return value;
        });
      }, function (err) {
        return Promise.resolve(isFunc ? onFulfilledOrRejected(err, false) : 0).then(function () {
          return Promise.reject(err);
        });
      });
    }

    /**
     * @method Promise#then
     * @param {onFulfilled} [onFulfilled] - onFulfilled callback.
     * @param {onRejected} [onRejected] - onRejected callback.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then
     */

  }, {
    key: 'then',
    value: function then(onFulfilled, onRejected) {
      var promise = this.$$;

      if (promise.status === 'pending') {
        return new Promise(function (resolve, reject) {
          promise.handle('reject', onRejected, resolve, reject, secret);
          promise.handle('resolve', onFulfilled, resolve, reject, secret);
        });
      }

      promise.handled = secret;

      var value = promise.value;


      var method = void 0;
      var handler = void 0;

      if (promise.status === 'fulfilled') {
        method = 'resolve';
        handler = onFulfilled;
      } else {
        method = 'reject';
        handler = onRejected;
      }

      if (!isFunction(handler)) {
        return Promise[method](value);
      }

      try {
        return Promise.resolve(handler(value));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }], [{
    key: 'all',
    value: function all(iterable) {
      var array = [];

      var toResolve = 0;

      if (iterable[iterator]) {
        iterable = iterable[iterator]();

        return new Promise(function (resolve, reject) {
          var next = void 0;
          var i = 0;

          var _loop = function _loop() {
            var promise = Promise.resolve(next.value);

            toResolve++;

            (function (i) {
              promise.then(function (value) {
                toResolve--;
                array[i] = value;

                setTimeout(function () {
                  if (next.done && !toResolve) {
                    resolve(array);
                  }
                }, 1);
              }, reject);
            })(i++);
          };

          while (!(next = iterable.next()).done) {
            _loop();
          }

          if (!i) {
            return Promise.resolve([]);
          }
        });
      }

      var length = iterable.length;

      if (!length) {
        return Promise.resolve([]);
      }

      toResolve = length;

      return new Promise(function (resolve, reject) {
        var _loop2 = function _loop2(i) {
          var promise = Promise.resolve(iterable[i]);

          promise.then(function (value) {
            toResolve--;
            array[i] = value;

            if (!toResolve) {
              resolve(array);
            }
          }, reject);
        };

        for (var i = 0; i < length; i++) {
          _loop2(i);
        }
      });
    }

    /**
     * @method Promise.race
     * @param {(Array|Iterable).<Promise|*>} iterable - Iterable object (like array) of promises
     * or any values.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race
     */

  }, {
    key: 'race',
    value: function race(iterable) {
      if (iterable[iterator]) {
        iterable = iterable[iterator]();

        return new Promise(function (resolve, reject) {
          var next = void 0;

          while (!(next = iterable.next()).done) {
            next.value.then(resolve, reject);
          }
        });
      }

      return new Promise(function (resolve, reject) {
        for (var i = 0, length = iterable.length; i < length; i++) {
          iterable[i].then(resolve, reject);
        }
      });
    }

    /**
     * @method Promise.reject
     * @param {*} value - Value to reject.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject
     */

  }, {
    key: 'reject',
    value: function reject(value) {
      return new Promise(function (resolve, reject) {
        reject(value);
      });
    }

    /**
     * @method Promise.resolve
     * @param {Promise|Thenable|*} value - Promise, thenable or any value to resolve.
     * @returns {Promise} New instance of Promise.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
     */

  }, {
    key: 'resolve',
    value: function resolve(value) {
      if (value && isFunction(value.then)) {
        return value;
      }

      return new Promise(function (resolve) {
        resolve(value);
      });
    }
  }]);
  return Promise;
}();

Promise$1.onError = null;
Promise$1.onUnhandledRejection = console.error.bind(console, '%s %o', 'Uncaught (in promise)');

var absoluteURLRegexp = /^(([a-z][a-z\d+\-.]*:)?\/\/|data:[a-z]+\/[a-z]+;base64,)/i;
var emptyArray = [];

var constructURL = (function (baseURL, url, params, query) {
  var URL = isAbsolute(url) ? url : String(baseURL).replace(/\/+$/, '') + '/' + String(url).replace(/^\/+/, '');

  iterate(params, function (value, param) {
    URL = replaceString(URL, ':' + param, encode(value));
  });

  var queryParams = querySwitcher(query, '');

  if (queryParams.length) {
    var prefix = URL.indexOf('?') === -1 ? '?' : '&';
    var postfix = map(queryParams, function (_ref) {
      var param = _ref.param,
          value = _ref.value;
      return encode(param) + '=' + encode(value);
    }).join('&');

    URL += prefix + postfix;
  }

  return URL;
});

function isAbsolute(url) {
  return absoluteURLRegexp.test(url);
}

function encode(string) {
  return encodeURIComponent(string);
}

function querySwitcher(query, prefix) {
  /* eslint indent: 0 */
  switch (true) {
    case isArray(query):
      {
        var _ret = function () {
          var queryParams = [];

          iterate(query, function (value) {
            if (isObject(value)) {
              return queryParams.push.apply(queryParams, toConsumableArray(querySwitcher(value, prefix + '[]')));
            }

            queryParams.push({
              param: prefix + '[]',
              value: value
            });
          });

          return {
            v: queryParams
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }

    case isObject(query):
      {
        var _ret2 = function () {
          var queryParams = [];

          iterate(query, function (value, param) {
            if (isObject(value)) {
              queryParams.push.apply(queryParams, toConsumableArray(querySwitcher(value, prefix ? prefix + '[' + param + ']' : param)));

              return;
            }

            queryParams.push({
              param: prefix ? prefix + '[' + param + ']' : param,
              value: String(value)
            });
          });

          return {
            v: queryParams
          };
        }();

        if ((typeof _ret2 === 'undefined' ? 'undefined' : _typeof(_ret2)) === "object") return _ret2.v;
      }

    default:
      {
        return emptyArray;
      }
  }
}

var parseHeaders = (function (rawHeaders) {
  var headers = {};

  iterate((rawHeaders || '').split('\n'), function (value) {
    var index = value.indexOf(':');
    var key = trim(value.substring(0, index));
    var val = trim(value.substring(index + 1));

    if (key) {
      headers[key] = (headers[key] ? headers[key] + ', ' : '') + val;
    }
  });

  return headers;
});

var notToTransform = ['FormData', 'File', 'Blob', 'ArrayBuffer', 'String', 'Number'];
var withoutBody = ['DELETE', 'GET', 'HEAD'];

var transformData = (function (data, method, headers) {
  if (withoutBody.indexOf(method) !== -1) {
    return null;
  }

  if (isObject(data) && notToTransform.indexOf(toStringTag(data)) === -1) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    return JSON.stringify(data);
  }

  return data;
});

/**
 * @typedef {'get'|'post'|'delete'|'head'|'put'|'patch'} AjaxerMethod
 * @public
 */

/**
 * @typedef {Object} AjaxerConfig
 * @public
 * @property {Array.<AjaxerAfterMiddleware|AjaxerErrorAfterMiddleware>} [after]
 * @property {Object} [auth]
 * @property {String} [auth.username]
 * @property {String} [auth.password]
 * @property {String} [baseURL]
 * @property {Array.<AjaxerBeforeMiddleware|AjaxerErrorBeforeMiddleware>} [before]
 * @property {*} [data]
 * @property {Object.<String, String>} [headers]
 * @property {AjaxerMethod} [method]
 * @property {Object} [params]
 * @property {Object} [query]
 * @property {String} [responseType]
 * @property {Number} [timeout]
 * @property {String} [url]
 * @property {Boolean} [withCredentials]
 */

/**
 * @typedef {Object} AjaxerResponse
 * @public
 * @property {AjaxerConfig} config
 * @property {*} data
 * @property {Object.<String, String>} headers
 * @property {Number} status
 * @property {String} statusText
 * @property {XMLHttpRequest} xhr
 */

/**
 * @callback AjaxerAfterMiddleware
 * @public
 * @param {AjaxerResponse} config - Ajaxer response.
 */

/**
 * @callback AjaxerErrorAfterMiddleware
 * @public
 * @param {Error|*} err - Thrown error.
 * @param {AjaxerResponse} config - Ajaxer response.
 */

/**
 * @callback AjaxerBeforeMiddleware
 * @public
 * @param {AjaxerConfig} config - Ajaxer config.
 */

/**
 * @callback AjaxerErrorBeforeMiddleware
 * @public
 * @param {Error|*} err - Thrown error.
 * @param {AjaxerConfig} config - Ajaxer config.
 */

/**
 * @callback AjaxerConfigFunction
 * @public
 * @param {AjaxerConfig} config
 */

var defaults$$1 = {
  after: [],
  auth: {
    username: '',
    password: ''
  },
  baseURL: global$1.location.origin,
  before: [],
  data: null,
  headers: {},
  method: 'get',
  params: {},
  query: {},
  responseType: '',
  timeout: 0,
  url: '',
  withCredentials: false
};
var uploadMethods = ['POST', 'PUT'];

/**
 * @class Ajaxer
 * @extends Function
 * @public
 * @param {AjaxerConfig} [config = {}] - Config to add.
 * @returns {Ajaxer} Instance of Ajaxer.
 * An instance of Ajaxer is a function that simply calls #request with the same arguments.
 * @description Class for fetching data.
 *
 * @example
 * const ajaxer = new Ajaxer();
 *
 * ajaxer('/data').then((res) => {
 *   console.log(res);
 * });
 */

var Ajaxer = function (_Function) {
  inherits(Ajaxer, _Function);

  function Ajaxer() {
    var _ret;

    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Ajaxer);

    var _this = possibleConstructorReturn(this, (Ajaxer.__proto__ || Object.getPrototypeOf(Ajaxer)).call(this));

    function ajaxer() {
      return ajaxer.request.apply(ajaxer, arguments);
    }

    var conf = deepAssign({}, defaults$$1, config);

    if (conf.before.indexOf(fetchBeforeMiddleware) === -1) {
      conf.before.push(fetchBeforeMiddleware);
    }

    /**
     * @member {AjaxerConfig} Ajaxer#$$
     * @type {AjaxerConfig}
     * @public
     * @description Ajaxer config.
     */
    Object.defineProperty(ajaxer, '$$', { value: conf });
    Object.setPrototypeOf(ajaxer, Ajaxer.prototype);

    return _ret = ajaxer, possibleConstructorReturn(_this, _ret);
  }

  /**
   * @method Ajaxer#after
   * @public
   * @param {AjaxerAfterMiddleware|AjaxerErrorAfterMiddleware} middleware - Middleware to add.
   * @param {Boolean|*} [afterAll = true] - Boolean parameter where to put the middleware.
   * Truthy parameter stands for "to the end" and falsey for "to the beginning".
   * @returns {Ajaxer} Returns this.
   * @description Middleware that is called after the request.
   * If the middleware has 2 or less arguments it's treated as success middleware otherwise as an error one.
   * If the middleware returns a promise it becomes a part of the middleware chain.
   *
   * @example
   * const ajaxer = new Ajaxer()
   *   .after((err, res) => {
   *     console.log(err);
   *
   *     throw err;
   *   })
   *   .after((res) => {
   *     res.json = JSON.parse(res.data):
   *   });
   */


  createClass(Ajaxer, [{
    key: 'after',
    value: function after(middleware) {
      var afterAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var after = this.$$.after;


      if (afterAll) {
        after.push(middleware);
      } else {
        after.unshift(middleware);
      }

      return this;
    }

    /**
     * @method Ajaxer#before
     * @public
     * @param {AjaxerBeforeMiddleware|AjaxerErrorBeforeMiddleware} middleware - Middleware to add.
     * @param {Boolean|*} [beforeAll = true] - Boolean parameter where to put the middleware.
     * Truthy parameter stands for "to the beginning" and falsey for "to the end".
     * @returns {Ajaxer} Returns this.
     * @description Middleware that is called before the request.
     * If the middleware has 2 or less arguments it's treated as success middleware otherwise as an error one.
     * If the middleware returns a promise it becomes a part of the middleware chain.
     *
     * @example
     * const ajaxer = new Ajaxer()
     *   .before((err, req) => {
     *     console.log(err);
     *
     *     throw err;
     *   })
     *   .before((req) => {
     *     if (req.url === '/veryLongRequest') {
     *       req.timeout = 30000;
     *     }
     *   });
     */

  }, {
    key: 'before',
    value: function before(middleware) {
      var beforeAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var before = this.$$.before;


      if (beforeAll) {
        before.unshift(middleware);
      } else {
        before.push(middleware);
      }

      return this;
    }

    /**
     * @method Ajaxer#config
     * @public
     * @param {String|AjaxerConfig|AjaxerConfigFunction} [property] - If it's a function
     * it's called with the fetch config argument, if it's a string the value argument
     * is used for assigning this property to the fetch config
     * otherwise it's assigned to the fetch config.
     * @param {*} [value] - See the property argument.
     * @returns {Ajaxer|AjaxerConfig} If the argument is present this is returned otherwise the fetch config is returned.
     * @description Method for getting and setting config.
     *
     * @example
     * const ajaxer = new Ajaxer();
     *
     * ajaxer.config({ baseURL: 5000 });
     * ajaxer.config().timeout; // 5000
     *
     * ajaxer.config((config) => {
     *   config.baseURL += '/api';
     * });
     */

  }, {
    key: 'config',
    value: function config(property, value) {
      var config = this.$$;

      if (!arguments.length) {
        return config;
      }

      if (isFunction(property)) {
        property(config);
      } else {
        if (arguments.length >= 2) {
          property = defineProperty({}, property, value);
        }

        deepAssign(config, property);
      }

      return this;
    }

    /**
     * @method Ajaxer#delete
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for delete requests.
     *
     * @example
     * ajaxer.delete('/data').then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'delete',
    value: function _delete(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isString(url)) {
        config = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'delete' }, config));
    }

    /**
     * @method Ajaxer#get
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for get requests.
     *
     * @example
     * ajaxer.get('/data').then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'get',
    value: function get$$1(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isString(url)) {
        config = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'get' }, config));
    }

    /**
     * @method Ajaxer#head
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for head requests.
     *
     * @example
     * ajaxer.head('/data').then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'head',
    value: function head(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (!isString(url)) {
        config = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'head' }, config));
    }

    /**
     * @method Ajaxer#headers
     * @public
     * @param {String|Object.<String, String>} header - A header string or an object of the following format:
     * { [header]: [value1, value2, ...] }.
     * @param {String} [value] - Header value. If the first argument is a string
     * this has to be a header value.
     * @returns {Ajaxer} Returns this.
     * @description Method for setting request headers.
     *
     * @example
     * ajaxer
     *   .headers('My-Header', 'Value')
     *   .headers({
     *     'My-Another-Header': 'Value2'
     *   });
     */

  }, {
    key: 'headers',
    value: function headers(header, value) {
      var headers = this.$$.headers;


      if (arguments.length >= 2) {
        header = defineProperty({}, header, value);
      }

      iterate(header, function (value, header) {
        headers[header] = value;
      });

      return this;
    }

    /**
     * @method Ajaxer#instance
     * @public
     * @param {AjaxerConfig} [config] - New config if needed.
     * @returns {Ajaxer} New instance of Ajaxer.
     * @description Method for creating new ajaxer instances based on already existent.
     *
     * @example
     * const mainAjaxer = new Ajaxer({
     *   baseURL: '//other.domain.com/api',
     *   withCredentials: true
     * });
     *
     * const longAjaxer = mainAjaxer.instance({
     *   timeout: 10000
     * });
     */

  }, {
    key: 'instance',
    value: function instance() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var dataConfig = hasOwn(config, 'data') ? { data: config.data } : {};

      delete config.data;

      var conf = assign(deepAssign({}, this.$$, config), dataConfig);

      return new Ajaxer(conf);
    }

    /**
     * @method Ajaxer#patch
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {*} [data] - Additional parameter for uploading data.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for head requests.
     *
     * @example
     * ajaxer.patch('/data', { user: 'John' }).then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'patch',
    value: function patch(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (arguments.length && !isString(url)) {
        config = data;
        data = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'patch', data: data }, config));
    }

    /**
     * @method Ajaxer#post
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {*} [data] - Additional parameter for uploading data.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for head requests.
     *
     * @example
     * ajaxer.post('/data', { user: 'John' }).then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'post',
    value: function post(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (arguments.length && !isString(url)) {
        config = data;
        data = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'post', data: data }, config));
    }

    /**
     * @method Ajaxer#put
     * @public
     * @param {String} [url] - See {@link Ajaxer#request}.
     * @param {*} [data] - Additional parameter for uploading data.
     * @param {AjaxerConfig} [config] - See {@link Ajaxer#request}.
     * @returns {Promise.<AjaxerResponse, Error>} See {@link Ajaxer#request}.
     * @description Shorthand for #request for head requests.
     *
     * @example
     * ajaxer.put('/data', { user: 'John' }).then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'put',
    value: function put(url) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (arguments.length && !isString(url)) {
        config = data;
        data = url;
        url = undefined;
      }

      return this.request(url, assign({ method: 'put', data: data }, config));
    }

    /**
     * @method Ajaxer#request
     * @public
     * @param {String} [url] - URL for the request.
     * @param {AjaxerConfig} [config] - Additional config for this particular request.
     * @returns {Promise.<AjaxerResponse, Error>} Promise that is resolved with the request response.
     * @description Main function for making requests. All request methods call this method
     * including the fetch instance itself.
     *
     * @example
     * ajaxer.request('/data', { timeout: 1000 }).then((res) => {
     *   console.log(res);
     * });
     *
     * ajaxer.request({ timeout: 1000 }).then((res) => {
     *   console.log(res);
     * });
     *
     * ajaxer.request().then((res) => {
     *   console.log(res);
     * });
     */

  }, {
    key: 'request',
    value: function request(url) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (arguments.length === 1 && !isString(url)) {
        config = url;
      }

      var dataConfig = hasOwn(config, 'data') ? { data: config.data } : {};
      var urlConfig = isString(url) ? { url: url } : {};

      delete config.data;

      var conf = assign(deepAssign(deepClone(this.$$), urlConfig, config), dataConfig);

      var xhr = void 0;
      var promise = Promise$1.resolve();

      iterate(conf.before, function (middleware) {
        promise = promise.then(function () {
          if (middleware.length >= 2) {
            return Promise$1.resolve();
          }

          return new Promise$1(function (resolve) {
            resolve(middleware(conf));
          });
        }, function (err) {
          if (middleware.length < 2) {
            return Promise$1.reject(err);
          }

          return new Promise$1(function (resolve) {
            resolve(middleware(err, conf));
          });
        });
      });

      promise = promise.then(function () {
        return new Promise$1(function (resolve, reject) {
          var after = conf.after,
              _conf$auth = conf.auth,
              username = _conf$auth.username,
              password = _conf$auth.password,
              data = conf.data,
              headers = conf.headers,
              method = conf.method,
              onprogress = conf.onprogress,
              responseType = conf.responseType,
              timeout = conf.timeout,
              url = conf.url,
              withCredentials = conf.withCredentials;


          xhr = new XMLHttpRequest();

          xhr.open(method, url, true, username, password);

          iterate(headers, function (value, header) {
            xhr.setRequestHeader(header, value);
          });

          if (onprogress) {
            if (uploadMethods.indexOf(method) === -1) {
              xhr.onprogress = onprogress;
            } else {
              xhr.upload.onprogress = onprogress;
            }
          }

          xhr.onabort = function () {
            var error = new Error('Request was aborted');

            error.type = 'ABORT_ERROR';

            reject(error);

            xhr = null;
          };

          xhr.onerror = function () {
            var error = new Error('Network error');

            error.type = 'NETWORK_ERROR';

            reject(error);

            xhr = null;
          };

          xhr.ontimeout = function () {
            var error = new Error('Request time exceeded');

            error.type = 'TIMEOUT_ERROR';

            reject(error);

            xhr = null;
          };

          xhr.onreadystatechange = function () {
            if (!xhr || !xhr.status || xhr.readyState !== 4) {
              return;
            }

            var response = {
              config: conf,
              data: !responseType || responseType === 'text' ? xhr.responseText : xhr.response,
              headers: parseHeaders(xhr.getAllResponseHeaders()),
              status: xhr.status === 1223 ? 204 : xhr.status,
              statusText: xhr.status === 1223 ? 'No Content' : xhr.statusText,
              xhr: xhr
            };

            var promise = Promise$1.resolve();

            iterate(after, function (middleware) {
              promise = promise.then(function () {
                if (middleware.length >= 2) {
                  return Promise$1.resolve();
                }

                return new Promise$1(function (resolve) {
                  resolve(middleware(response));
                });
              }, function (err) {
                if (middleware.length < 2) {
                  return Promise$1.reject(err);
                }

                return new Promise$1(function (resolve) {
                  resolve(middleware(err, response));
                });
              });
            });

            resolve(promise.then(function () {
              return response;
            }).catch(function (err) {
              try {
                err.response = response;
              } catch (e) {
                throw err;
              }

              throw err;
            }));
          };

          xhr.responseType = responseType;
          xhr.timeout = +timeout || 0;
          xhr.withCredentials = !!withCredentials;

          xhr.send(data);
        });
      });

      promise.abort = function abort() {
        if (xhr) {
          xhr.abort();
        }

        return this;
      };

      return promise;
    }
  }]);
  return Ajaxer;
}(Function);

function fetchBeforeMiddleware(config) {
  var baseURL = config.baseURL,
      data = config.data,
      headers = config.headers,
      method = config.method,
      params = config.params,
      query = config.query,
      url = config.url;

  var METHOD = method.toUpperCase();

  config.method = METHOD;
  config.url = constructURL(baseURL, url, params, query);
  config.data = transformData(data, METHOD, headers);
}

/**
 * @const {Ajaxer} fetch
 * @type {Ajaxer}
 * @public
 * @description Empty instance of Ajaxer.
 */
var fetch = new Ajaxer();

window.Ajaxer = Ajaxer;

}());
//# sourceMappingURL=ajaxer.js.map