import {
  isObject,
  toStringTag
} from './utils';

const notToTransform = ['FormData', 'File', 'Blob', 'ArrayBuffer', 'String', 'Number'];
const withoutBody = ['DELETE', 'GET', 'HEAD'];

export default (data, method, headers) => {
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
};
