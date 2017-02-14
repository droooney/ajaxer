import {
  isFunction,
  isString,
  assign,
  iterate,
  deepAssign,
  deepClone,
  hasOwn
} from './utils';

import constructURL from './constructURL';
import parseHeaders from './parseHeaders';
import transformData from './transformData';

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

const defaults = {
  after: [],
  auth: {
    username: '',
    password: ''
  },
  baseURL: window.location.origin,
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
const uploadMethods = ['POST', 'PUT'];
let Promise;

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
class Ajaxer extends Function {
  /**
   * @method Ajaxer.usePromise
   * @public
   * @param {Promise} PromiseClass - Promise class to use.
   */
  static usePromise(PromiseClass) {
    Promise = PromiseClass;
  }

  constructor(config = {}) {
    super();

    function ajaxer() {
      return ajaxer.request.apply(ajaxer, arguments);
    }

    const conf = deepAssign({}, defaults, config);

    /**
     * @member {AjaxerConfig} Ajaxer#$$
     * @type {AjaxerConfig}
     * @public
     * @description Ajaxer config.
     */
    Object.defineProperty(ajaxer, '$$', { value: conf });
    Object.setPrototypeOf(ajaxer, Ajaxer.prototype);

    return ajaxer;
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
  after(middleware, afterAll = true) {
    const { after } = this.$$;

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
  before(middleware, beforeAll = true) {
    const { before } = this.$$;

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
   * ajaxer.config({ timeout: 5000 });
   * ajaxer.config().timeout; // 5000
   *
   * ajaxer.config((config) => {
   *   config.baseURL += '/api';
   * });
   */
  config(property, value) {
    const config = this.$$;

    if (!arguments.length) {
      return config;
    }

    if (isFunction(property)) {
      property(config);
    } else {
      if (arguments.length >= 2) {
        property = { [property]: value };
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
  delete(url, config = {}) {
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
  get(url, config = {}) {
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
  head(url, config = {}) {
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
  headers(header, value) {
    const { headers } = this.$$;

    if (arguments.length >= 2) {
      header = { [header]: value };
    }

    iterate(header, (value, header) => {
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
  instance(config = {}) {
    const dataConfig = hasOwn(config, 'data')
      ? { data: config.data }
      : {};

    delete config.data;

    const conf = assign(
      deepAssign({}, this.$$, config),
      dataConfig
    );

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
  patch(url, data = {}, config = {}) {
    if (arguments.length && !isString(url)) {
      config = data;
      data = url;
      url = undefined;
    }

    return this.request(url, assign({ method: 'patch', data }, config));
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
  post(url, data = {}, config = {}) {
    if (arguments.length && !isString(url)) {
      config = data;
      data = url;
      url = undefined;
    }

    return this.request(url, assign({ method: 'post', data }, config));
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
  put(url, data = {}, config = {}) {
    if (arguments.length && !isString(url)) {
      config = data;
      data = url;
      url = undefined;
    }

    return this.request(url, assign({ method: 'put', data }, config));
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
  request(url, config = {}) {
    if (arguments.length === 1 && !isString(url)) {
      config = url;
    }

    const dataConfig = hasOwn(config, 'data')
      ? { data: config.data }
      : {};
    const urlConfig = isString(url)
      ? { url }
      : {};

    delete config.data;

    const conf = assign(
      deepAssign(
        deepClone(this.$$),
        urlConfig,
        config
      ),
      dataConfig
    );

    let xhr;
    let promise = Promise.resolve();

    iterate(conf.before, (middleware) => {
      promise = promise.then(() => {
        if (middleware.length >= 2) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          resolve(middleware(conf));
        });
      }, (err) => {
        if (middleware.length < 2) {
          return Promise.reject(err);
        }

        return new Promise((resolve) => {
          resolve(middleware(err, conf));
        });
      });
    });

    promise = promise.then(() => new Promise((resolve, reject) => {
      const {
        after,
        auth: {
          username,
          password
        },
        baseURL,
        data,
        headers,
        method,
        onprogress,
        params,
        query,
        responseType,
        timeout,
        url,
        withCredentials
      } = conf;
      const eventualMethod = method.toUpperCase();
      const eventualURL = constructURL(baseURL, url, params, query);
      const eventualData = transformData(data, eventualMethod, headers);

      xhr = new XMLHttpRequest();

      xhr.open(eventualMethod, eventualURL, true, username, password);

      iterate(headers, (value, header) => {
        xhr.setRequestHeader(header, value);
      });

      if (onprogress) {
        if (uploadMethods.indexOf(method) === -1) {
          xhr.onprogress = onprogress;
        } else {
          xhr.upload.onprogress = onprogress;
        }
      }

      xhr.onabort = () => {
        const error = new Error('Request was aborted');

        error.type = 'ABORT_ERROR';

        reject(error);

        xhr = null;
      };

      xhr.onerror = () => {
        const error = new Error('Network error');

        error.type = 'NETWORK_ERROR';

        reject(error);

        xhr = null;
      };

      xhr.ontimeout = () => {
        const error = new Error('Request time exceeded');

        error.type = 'TIMEOUT_ERROR';

        reject(error);

        xhr = null;
      };

      xhr.onreadystatechange = () => {
        if (!xhr || !xhr.status || xhr.readyState !== 4) {
          return;
        }

        const response = {
          config: conf,
          data: !responseType || responseType === 'text' ? xhr.responseText : xhr.response,
          headers: parseHeaders(xhr.getAllResponseHeaders()),
          status: xhr.status === 1223 ? 204 : xhr.status,
          statusText: xhr.status === 1223 ? 'No Content' : xhr.statusText,
          xhr
        };

        let promise = Promise.resolve();

        iterate(after, (middleware) => {
          promise = promise.then(() => {
            if (middleware.length >= 2) {
              return Promise.resolve();
            }

            return new Promise((resolve) => {
              resolve(middleware(response));
            });
          }, (err) => {
            if (middleware.length < 2) {
              return Promise.reject(err);
            }

            return new Promise((resolve) => {
              resolve(middleware(err, response));
            });
          });
        });

        resolve(promise
          .then(() => response)
          .catch((err) => {
            try {
              err.response = response;
            } catch (e) {
              throw err;
            }

            throw err;
          })
        );
      };

      xhr.responseType = responseType;
      xhr.timeout = +timeout || 0;
      xhr.withCredentials = !!withCredentials;

      xhr.send(eventualData);
    }));

    promise.abort = function abort() {
      if (xhr) {
        xhr.abort();
      }

      return this;
    };

    return promise;
  }
}

/**
 * @const {Ajaxer} ajaxer
 * @type {Ajaxer}
 * @public
 * @description Empty instance of Ajaxer.
 */
const ajaxer = new Ajaxer();

export default Ajaxer;
export { Ajaxer, ajaxer };
