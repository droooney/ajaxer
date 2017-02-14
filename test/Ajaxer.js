import {
  deepStrictEqual,
  notEqual,
  strictEqual
} from 'assert';
import Promise from 'el-promise';
import Ajaxer from '../lib/Ajaxer';

const { random } = Math;
const origin = '/ajaxer';

Ajaxer.usePromise(Promise);

describe('it should test Ajaxer#', () => {
  describe('after()', () => {
    it('should insert "after" middleware', () => {
      const ajaxer = new Ajaxer();
      const middleware1 = () => {};
      const middleware2 = () => {};

      ajaxer.after(middleware1);

      deepStrictEqual(ajaxer.$$.after, [middleware1]);

      ajaxer.after(middleware2);

      deepStrictEqual(ajaxer.$$.after, [middleware1, middleware2]);
    });
  });
  describe('before()', () => {
    it('should insert "before" middleware', () => {
      const ajaxer = new Ajaxer();
      const middleware1 = () => {};
      const middleware2 = () => {};

      ajaxer.before(middleware1);

      deepStrictEqual(ajaxer.$$.before, [middleware1]);

      ajaxer.before(middleware2);

      deepStrictEqual(ajaxer.$$.before, [middleware2, middleware1]);
    });
  });
  describe('config()', () => {
    it('should support object argument', () => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.config({
        timeout: rand
      });

      strictEqual(ajaxer.$$.timeout, rand);
    });
    it('should support (prop, value) argument', () => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.config('timeout', rand);

      strictEqual(ajaxer.$$.timeout, rand);
    });
    it('should support function argument', () => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.config((config) => {
        config.timeout = rand;
      });

      strictEqual(ajaxer.$$.timeout, rand);
    });
  });
  describe('delete()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'delete'
        });

        done();
      };

      ajaxer.delete();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'delete'
        });

        done();
      };

      ajaxer.delete(URL);
    });
    it('should support call with only config', (done) => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'delete',
          timeout: rand
        });

        done();
      };

      ajaxer.delete({
        timeout: rand
      });
    });
    it('should support call with both url and config', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'delete',
          timeout: rand
        });

        done();
      };

      ajaxer.delete(URL, {
        timeout: rand
      });
    });
  });
  describe('get()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'get'
        });

        done();
      };

      ajaxer.get();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'get'
        });

        done();
      };

      ajaxer.get(URL);
    });
    it('should support call with only config', (done) => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'get',
          timeout: rand
        });

        done();
      };

      ajaxer.get({
        timeout: rand
      });
    });
    it('should support call with both url and config', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'get',
          timeout: rand
        });

        done();
      };

      ajaxer.get(URL, {
        timeout: rand
      });
    });
  });
  describe('head()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'head'
        });

        done();
      };

      ajaxer.head();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'head'
        });

        done();
      };

      ajaxer.head(URL);
    });
    it('should support call with only config', (done) => {
      const ajaxer = new Ajaxer();
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'head',
          timeout: rand
        });

        done();
      };

      ajaxer.head({
        timeout: rand
      });
    });
    it('should support call with both url and config', () => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'head',
          timeout: rand
        });
      };

      ajaxer.head(URL, {
        timeout: rand
      });
    });
  });
  describe('headers()', () => {
    it('should support (header, value: String) syntax', () => {
      const ajaxer = new Ajaxer();

      ajaxer.headers('foo', 'bar');

      deepStrictEqual(ajaxer.$$.headers, {
        foo: 'bar'
      });
    });
    it('should support { header: value: String, ... } syntax', () => {
      const ajaxer = new Ajaxer();

      ajaxer.headers({
        foo: 'bar'
      });

      deepStrictEqual(ajaxer.$$.headers, {
        foo: 'bar'
      });
    });
  });
  describe('instance()', () => {
    it('should create new instance without config without arguments', () => {
      const ajaxer = new Ajaxer({
        headers: {
          foo: 'bar'
        }
      });
      const instance = ajaxer.instance();
      const oldConfig = ajaxer.config();
      const newConfig = instance.config();

      notEqual(oldConfig.auth, newConfig.auth);
      notEqual(oldConfig.headers, newConfig.headers);
      strictEqual(oldConfig.headers.foo, newConfig.headers.foo);
      notEqual(oldConfig.query, newConfig.query);
      notEqual(oldConfig.params, newConfig.params);
    });
    it('should not modify context\'s config', () => {
      const ajaxer = new Ajaxer();

      ajaxer.instance({
        auth: {
          username: 'foo',
          password: 'bar'
        },
        baseURL: '//foo',
        headers: {
          foo: 'bar',
          bar: 'foo'
        },
        params: {
          foo: 'bar',
          bar: 'foo'
        },
        query: {
          foo: 'bar',
          bar: 'foo'
        },
        timeout: 5000
      });

      const config = ajaxer.config();

      deepStrictEqual(config.auth, {
        username: '',
        password: ''
      });
      strictEqual(config.baseURL, window.location.origin);
      deepStrictEqual(config.headers, {});
      deepStrictEqual(config.params, {});
      deepStrictEqual(config.query, {});
      strictEqual(config.timeout, 0);
    });
    it('should create new instance with config argument', () => {
      const ajaxer = new Ajaxer({
        auth: {
          username: 'foo',
          password: 'bar'
        },
        baseURL: '//foo',
        headers: {
          foo: 'bar',
          bar: 'foo'
        },
        params: {
          foo: 'bar',
          bar: 'foo'
        },
        query: {
          foo: 'bar',
          bar: 'foo'
        }
      });
      const timeout = random();
      const instance = ajaxer.instance({
        auth: {
          username: 'baz'
        },
        headers: {
          foo: 'baz',
          baz: 'foo'
        },
        params: {
          foo: 'baz',
          baz: 'foo'
        },
        query: {
          foo: 'baz',
          baz: 'foo'
        },
        timeout
      });
      const config = instance.config();

      deepStrictEqual(config.auth, {
        username: 'baz',
        password: 'bar'
      });
      strictEqual(config.baseURL, '//foo');
      deepStrictEqual(config.headers, {
        foo: 'baz',
        bar: 'foo',
        baz: 'foo'
      });
      deepStrictEqual(config.params, {
        foo: 'baz',
        bar: 'foo',
        baz: 'foo'
      });
      deepStrictEqual(config.query, {
        foo: 'baz',
        bar: 'foo',
        baz: 'foo'
      });
      strictEqual(config.timeout, timeout);
    });
  });
  describe('patch()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'patch',
          data: {}
        });

        done();
      };

      ajaxer.patch();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'patch',
          data: {}
        });

        done();
      };

      ajaxer.patch(URL);
    });
    it('should support Ajaxer with only data', (done) => {
      const ajaxer = new Ajaxer();
      const data = { foo: 'bar' };

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'patch',
          data
        });

        done();
      };

      ajaxer.patch(data);
    });
    it('should support call with url and data', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = { foo: 'bar' };

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'patch',
          data
        });

        done();
      };

      ajaxer.patch(URL, data);
    });
    it('should support call with data and config', (done) => {
      const ajaxer = new Ajaxer();
      const data = {
        foo: 'bar'
      };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'patch',
          data,
          timeout: rand
        });

        done();
      };

      ajaxer.patch(data, {
        timeout: rand
      });
    });
    it('should support call with url, data and config', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = {
        foo: 'bar'
      };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'patch',
          data,
          timeout: rand
        });

        done();
      };

      ajaxer.patch(URL, data, {
        timeout: rand
      });
    });
  });
  describe('post()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'post',
          data: {}
        });

        done();
      };

      ajaxer.post();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'post',
          data: {}
        });

        done();
      };

      ajaxer.post(URL);
    });
    it('should support call with only data', (done) => {
      const ajaxer = new Ajaxer();
      const data = {
        foo: 'bar'
      };

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'post',
          data
        });
        
        done();
      };

      ajaxer.post(data);
    });
    it('should support call with url and data', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = {
        foo: 'bar'
      };

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'post',
          data
        });
        
        done();
      };

      ajaxer.post(URL, data);
    });
    it('should support call with data and config', (done) => {
      const ajaxer = new Ajaxer();
      const data = {
        foo: 'bar'
      };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'post',
          data,
          timeout: rand
        });
        
        done();
      };

      ajaxer.post(data, {
        timeout: rand
      });
    });
    it('should support call with url, data and config', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = { foo: 'bar' };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'post',
          data,
          timeout: rand
        });
        
        done();
      };

      ajaxer.post(URL, data, {
        timeout: rand
      });
    });
  });
  describe('put()', () => {
    it('should support call without arguments', (done) => {
      const ajaxer = new Ajaxer();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'put',
          data: {}
        });
        
        done();
      };

      ajaxer.put();
    });
    it('should support call with only url', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'put',
          data: {}
        });
        
        done();
      };

      ajaxer.put(URL);
    });
    it('should support call with only data', (done) => {
      const ajaxer = new Ajaxer();
      const data = {
        foo: 'bar'
      };

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'put',
          data
        });
        
        done();
      };

      ajaxer.put(data);
    });
    it('should support call with url and data', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = { foo: 'bar' };

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'put',
          data
        });
        
        done();
      };

      ajaxer.put(URL, data);
    });
    it('should support call with data and config', (done) => {
      const ajaxer = new Ajaxer();
      const data = {
        foo: 'bar'
      };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, undefined);
        deepStrictEqual(config, {
          method: 'put',
          data,
          timeout: rand
        });
        
        done();
      };

      ajaxer.put(data, {
        timeout: rand
      });
    });
    it('should support call with url, data and config', (done) => {
      const ajaxer = new Ajaxer();
      const URL = '/foo';
      const data = {
        foo: 'bar'
      };
      const rand = random();

      ajaxer.request = (url, config) => {
        strictEqual(url, URL);
        deepStrictEqual(config, {
          method: 'put',
          data,
          timeout: rand
        });
        
        done();
      };

      ajaxer.put(URL, data, {
        timeout: rand
      });
    });
  });
  describe('request()', () => {
    it('should construct url the right way', (done) => {
      const ajaxer = new Ajaxer({
        baseURL: origin,
        responseType: 'json',
        url: '/foo/bar/:baz/:baz/:foo/:bar?foo=bar'
      });

      ajaxer
        .request({
          params: {
            foo: 'bar',
            bar: 'baz',
            baz: 'foo'
          },
          query: {
            a: 2,
            b: ['s', 2],
            c: {
              d: 't',
              e: {
                f: 3,
                g: [
                  '5',
                  {
                    h: 1,
                    i: [
                      2,
                      [9, 'p']
                    ]
                  }
                ]
              }
            }
          }
        })
        .then(({ data }) => {
          strictEqual(
            data.url,
            `
              /ajaxer/foo/bar/foo/foo/bar/baz?foo=bar&a=2&b%5B%5D=s&b%5B%5D=2&c%5Bd%5D=t&
              c%5Be%5D%5Bf%5D=3&c%5Be%5D%5Bg%5D%5B%5D=5&c%5Be%5D%5Bg%5D%5B%5D%5Bh%5D=1&
              c%5Be%5D%5Bg%5D%5B%5D%5Bi%5D%5B%5D=2&c%5Be%5D%5Bg%5D%5B%5D%5Bi%5D%5B%5D%5B%5D=9&
              c%5Be%5D%5Bg%5D%5B%5D%5Bi%5D%5B%5D%5B%5D=p
            `.replace(/\s+/g, '')
          );

          done();
        })
        .catch(done);
    });
    it('should test data transformation', (done) => {
      const rand = random().toString(36);
      const originalData = { rand };
      const ajaxer = new Ajaxer({
        baseURL: origin,
        responseType: 'json'
      });

      ajaxer
        .post('/transformData', originalData, {
          responseType: 'json'
        })
        .then(({ data }) => {
          deepStrictEqual(data.body, originalData);

          done();
        })
        .catch(done);
    });
    it('should test request itself', (done) => {
      const ajaxer = new Ajaxer({
        baseURL: origin
      });

      ajaxer('/request')
        .then(({ headers }) => {
          strictEqual(headers['Foo-Header'], 'Foo');
          strictEqual(headers['Bar-Header'], 'Bar');
          strictEqual(headers['Baz-Header'], 'Baz');

          done();
        })
        .catch(done);
    });
    it('should test timeout', (done) => {
      const ajaxer = new Ajaxer({
        baseURL: origin,
        timeout: 200
      });

      ajaxer('/timeout/500')
        .then(done)
        .catch((err) => {
          strictEqual(err.type, 'TIMEOUT_ERROR');
          strictEqual(err.message, 'Request time exceeded');

          done();
        })
        .catch(done);
    });
    it('should test abort', (done) => {
      const ajaxer = new Ajaxer({
        baseURL: origin
      });

      ajaxer('/abort')
        .abort()
        .then(done)
        .catch((err) => {
          strictEqual(err.type, 'ABORT_ERROR');
          strictEqual(err.message, 'Request was aborted');

          done();
        })
        .catch(done);
    });
    it('should test middlewares', (done) => {
      const ajaxer = new Ajaxer({
        baseURL: origin
      });
      let testsDone = 0;

      ajaxer.before(({ headers }) => {
        headers['Foo-Header'] = '1';
      });

      ajaxer.after(({ status }) => {
        if (status === 200) {
          return;
        }

        throw new Error(`Wrong status (${ status })`);
      });

      ajaxer.after((err, res) => {
        console.error(err, res);

        throw err;
      });

      ajaxer.after((res) => {
        res.json = JSON.parse(res.data);
      });

      ajaxer('/middlewares-with-headers')
        .then(({ data }) => {
          const { headers } = JSON.parse(data);

          strictEqual(headers['foo-header'], '1');

          allDone();
        })
        .catch(done);

      ajaxer('/status/404')
        .then(done)
        .catch((err) => {
          strictEqual(err.message, 'Wrong status (404)');

          allDone();
        })
        .catch(done);

      ajaxer
        .post('/success-middleware', {
          date: new Date('1999-12-31T23:59:59.999Z')
        })
        .then(({ json }) => {
          const { date } = json.body;

          strictEqual(date, '1999-12-31T23:59:59.999Z');

          allDone();
        })
        .catch(done);

      function allDone() {
        if (++testsDone === 3) {
          done();
        }
      }
    });
  });
});
