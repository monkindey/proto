/**
 * @author monkindey
 * @date 2017.5.14
 * @description 原型链
 * __proto__
 * prototype
 * constructor
 * class
 * this
 * new
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    define('protoTrace', factory());
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    window.protoTrace = factory();
  }
})(function() {
  /**
 * Number
 * String
 * Boolean
 * Function
 * Object
 */
  function isNative(Constructor) {
    if (/native code/.test(Constructor.toString())) {
      return true;
    } else {
      return false;
    }
  }

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /**
 * 获取对象所有属于它自己的属性
 */
  function grabProperties(target) {
    return Object.keys(target).filter(key => hasOwn(target, key)).map(key => {
      const prop = Object.create(null, {
        [key]: {
          value: target[key],
          configurable: true,
          writable: true
        }
      });

      return prop;
    });
  }

  function grabName(target) {
    var proto = target.prototype;
    // new 出来的Object
    if (!proto) {
      return `${target.constructor.name} Instance`;
    }

    // Object这个东西有点奇怪
    if (typeof proto.constructor === 'function') {
      return proto.constructor.name;
    }
  }

  return function protoTrace(target, acc) {
    if (acc === undefined) {
      acc = [];
    }

    if (!target) {
      return acc;
    }

    var name = grabName(target);
    var properties = grabProperties(target);
    var proto = Object.create(null);
    proto.name = name;
    proto.properties = properties;

    acc.push(proto);

    // 针对被new出来的object
    if (!target.prototype) {
      protoTrace(target.__proto__.constructor, acc);
    } else {
      // 已经递归完了
      if (isNative(target.prototype.__proto__.constructor)) {
        return acc;
      } else {
        protoTrace(target.prototype.__proto__.constructor, acc);
      }
    }

    return acc;
  }
});
