import {
  isArray,
  isObject,
  iterate,
  map,
  replaceString
} from './utils';

const absoluteURLRegexp = /^(([a-z][a-z\d+\-.]*:)?\/\/|data:[a-z]+\/[a-z]+;base64,)/i;
const emptyArray = [];

export default (baseURL, url, params, query) => {
  let URL = isAbsolute(url)
    ? url
    : `${ String(baseURL).replace(/\/+$/, '') }/${ String(url).replace(/^\/+/, '') }`;

  iterate(params, (value, param) => {
    URL = replaceString(URL, `:${ param }`, encode(value));
  });

  const queryParams = querySwitcher(query, '');

  if (queryParams.length) {
    const prefix = URL.indexOf('?') === -1 ? '?' : '&';
    const postfix = map(queryParams, ({ param, value }) => (
      `${ encode(param) }=${ encode(value) }`
    )).join('&');

    URL += prefix + postfix;
  }

  return URL;
};

function isAbsolute(url) {
  return absoluteURLRegexp.test(url);
}

function encode(string) {
  return encodeURIComponent(string);
}

function querySwitcher(query, prefix) {
  /* eslint indent: 0 */
  switch (true) {
    case isArray(query): {
      const queryParams = [];

      iterate(query, (value) => {
        if (isObject(value)) {
          return queryParams.push(...querySwitcher(value, `${ prefix }[]`));
        }

        queryParams.push({
          param: `${ prefix }[]`,
          value
        });
      });

      return queryParams;
    }

    case isObject(query): {
      const queryParams = [];

      iterate(query, (value, param) => {
        if (isObject(value)) {
          queryParams.push(...querySwitcher(value, prefix ? `${ prefix }[${ param }]` : param));

          return;
        }

        queryParams.push({
          param: prefix ? `${ prefix }[${ param }]` : param,
          value: String(value)
        });
      });

      return queryParams;
    }

    default: {
      return emptyArray;
    }
  }
}
