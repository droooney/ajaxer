const {
  hasOwnProperty,
  toString
} = {};
const whiteSpace = /^\s*|\s*$/g;
const primitive = /^(number|string|boolean|symbol|undefined)$/;

export function toStringTag(value) {
  return toString
    .call(value)
    .slice(8, -1);
}

export const isArray = Array.isArray || ((value) => (
  toStringTag(value) === 'Array'
));

export function isFunction(value) {
  return typeof value === 'function' || toStringTag(value) === 'Function';
}

export function isObject(value) {
  return typeof value && (typeof value === 'object' || isFunction(value));
}

export function isPrimitive(value) {
  return value === null || primitive.test(typeof value);
}

export function isString(value) {
  return toStringTag(value) === 'String';
}

export function assign(target, ...objects) {
  iterate(objects, (source) => {
    iterate(source, (value, key) => {
      target[key] = value;
    });
  });

  return target;
}

export function iterate(object, callback) {
  const array = isArray(object);

  let iterated = 0;
  const { length } = object || {};

  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      if (array && iterated++ >= length) {
        break;
      }

      callback(object[key], array ? +key : key, object);
    }
  }
}

export function map(object, callback) {
  const newObject = isArray(object)
    ? []
    : {};

  iterate(object, (value, key) => {
    newObject[key] = callback(value, key, object);
  });

  return newObject;
}

export function trim(string) {
  return string.replace(whiteSpace, '');
}

export function replaceString(string, stringToReplace, replacement) {
  return string
    .split(stringToReplace)
    .join(replacement);
}

export function deepClone(object) {
  if (isPrimitive(object) || isFunction(object)) {
    return object;
  }

  const clone = isArray(object)
    ? []
    : {};

  iterate(object, (value, key) => {
    clone[key] = deepClone(value);
  });

  return clone;
}

export function deepAssign(target, ...objects) {
  iterate(objects, (object) => {
    iterate(object, (object, key) => {
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

export function hasOwn(object, property) {
  return hasOwnProperty.call(object, property);
}
