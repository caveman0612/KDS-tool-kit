var ctMap = Class.create();
ctMap.prototype = {
  //Constructor.
  //@param map is optional.   If provided, it must be of type ctMap and its elements will be put() into the new Map.
  initialize: function (keyType, valType, map) {
    if (keyType == undefined || keyType == null || keyType == '') {
      throw "Mandatory constructor parameter 'keyType' was omitted when constructing object of type ctMap";
    }

    if (!/^(number|string|object|boolean)$/i.test(keyType)) {
      throw "Constructor parameter 'keyType' must be number|string|object|boolean when constructing object of type ctMap";
    }

    if (valType == undefined || valType == null || valType == '') {
      throw "Mandatory constructor parameter 'valType' was omitted when constructing object of type ctMap";
    }

    if (!/^(number|string|object|boolean)$/i.test(valType)) {
      throw "Constructor parameter 'valType' must be number|string|object|boolean when constructing object of type ctMap";
    }

    this.keyType = keyType.toLowerCase();
    this.valType = valType.toLowerCase();
    this.obj = {};
    this.length = 0;

    if (map && map.type == 'ctMap') {
      var iterator = map.getIterator();
      while (iterator.next()) {
        this.obj[iterator.getCurrent().key] = iterator.getCurrent().value;
      }
    }
  },

  //Adds an element to the map using he key/value params
  put: function (key, val) {
    var passedKeyType = (typeof key).toLowerCase();
    var passedValType = (typeof val).toLowerCase();
    if (passedKeyType != this.keyType) {
      throw (
        'ctMap was constructed to contain only keys of type:' +
        this.keyType +
        ' Attempted to put element using key of type:' +
        passedKeyType
      );
    }

    if (passedValType != this.valType) {
      throw (
        'ctMap was constructed to contain only values of type:' +
        this.valType +
        ' Attempted to put value of type:' +
        passedValType
      );
    }

    this.length++;
    this.obj[key] = val;
  },

  //Returns true if the map contains this key
  containsKey: function (key) {
    var passedKeyType = (typeof key).toLowerCase();
    if (passedKeyType != this.keyType) {
      throw (
        'ctMap was constructed to contain only keys of type:' +
        this.keyType +
        ' Attempted to call containsKey with parameter of type:' +
        passedKeyType
      );
    }

    return this.obj.hasOwnProperty(key);
  },

  //Returns undefined if the key does not exist, otherwise returns the associated value
  getValue: function (key) {
    var passedKeyType = (typeof key).toLowerCase();
    if (passedKeyType != this.keyType) {
      throw (
        'ctMap was constructed to contain only keys of type:' +
        this.keyType +
        ' Attempted to call getValue with parameter of type:' +
        passedKeyType
      );
    }

    return this.obj[key];
  },

  //Remove an element at a key
  remove: function (key) {
    var passedKeyType = (typeof key).toLowerCase();
    if (passedKeyType != this.keyType) {
      throw (
        'ctMap was constructed to contain only keys of type:' +
        this.keyType +
        ' Attempted to call remove with parameter of type:' +
        passedKeyType
      );
    }

    if (!this.obj.hasOwnProperty(key)) {
      return false;
    }

    this.length--;
    delete this.obj[key];
    return true;
  },

  //Returns the size of the structure
  size: function () {
    return this.length;
  },

  //Determines if map is empty
  isEmpty: function () {
    return this.length == 0;
  },

  //Purge all elements
  purgeAll: function () {
    this.length = 0;
    this.obj = {};
  },

  //Returns a JSON encoded string representation of the map
  toString: function () {
    //try client first. This will throw if executing on the server
    try {
      if (window) {
        return JSON.stringify(this.obj);
      }
    } catch (e) {
      //Server side
      try {
        return new JSON().encode(this.obj);
      } catch (e) {
        throw 'ctMap.toString() script include Error:' + e.message;
      }
    }
  },

  //Returns an array of the keys
  getKeys: function () {
    var keys = [];
    for (var k in this.obj) {
      keys.push(k);
    }
    return keys;
  },

  //Returns an array of the values
  getValues: function () {
    var vals = [];
    for (var k in this.obj) {
      vals.push(this.obj[k]);
    }
    return vals;
  },

  //Returns an iterator with functions for next(), hasNext() and getCurrent().   getCurrent() returns an obj with keys: key, value
  getIterator: function () {
    var store = [];
    var currentVal;
    var currentIndex;
    for (var k in this.obj) {
      store.push({ key: k, value: this.obj[k] });
    }

    currentIndex = 0;

    //sets var "currentVal", returns true if there are more elements, false otherwise
    function hasNext() {
      if (currentIndex < store.length) {
        currentVal = store[currentIndex];
        return true;
      } else {
        return false;
      }
    }

    //Returns the currentValue, set the var "currentVal", increments the internal index
    function next() {
      currentVal = store[currentIndex];
      return store[currentIndex++];
    }

    //Returns an object with keys: key, value
    function getCurrent() {
      return currentVal;
    }

    return { next: next, getCurrent: getCurrent, hasNext: hasNext };
  },

  type: 'ctMap',
};
