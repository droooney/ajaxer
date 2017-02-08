import {
  iterate,
  trim
} from './utils';

export default (rawHeaders) => {
  const headers = {};

  iterate((rawHeaders || '').split('\n'), (value) => {
    const index = value.indexOf(':');
    const key = trim(value.substring(0, index));
    const val = trim(value.substring(index + 1));

    if (key) {
      headers[key] = (headers[key] ? `${ headers[key] }, ` : '') + val;
    }
  });

  return headers;
};
