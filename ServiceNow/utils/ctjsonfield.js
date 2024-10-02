var ctJSONField = Class.create();
ctJSONField.prototype = {
  initialize: function (initialJSON) {
    if (initialJSON == undefined || initialJSON == null)
      throw 'ctJSONField error: field must be defined on declaration';

    this.field;
    this.isValid = false;
    var jsonParser = new JSONParser();
    if (this._isJson(initialJSON) == true) {
      this.field = jsonParser.parse(initialJSON);
      this.isValid = true;
    }
  },

  _isJson: function (jsonData) {
    jsonData =
      typeof jsonData !== 'string' ? JSON.stringify(jsonData) : jsonData;

    try {
      jsonData = JSON.parse(jsonData);
    } catch (e) {
      return false;
    }

    if (typeof jsonData === 'object' && jsonData !== null) {
      return true;
    }

    return false;
  },

  setValue: function (dataKey, dataValue) {
    if (this.isValid) {
      this.field[dataKey] = dataValue;
      return true;
    } else {
      return false;
    }
  },

  getJSONString: function () {
    return new JSON().encode(this.field);
  },

  getData: function (dataKey) {
    if (this.isValid) {
      if (this.field[dataKey] !== undefined) {
        return this.field[dataKey];
      }
    }

    return false;
  },

  getValue: function (dataKey) {
    if (this.isValid) {
      if (this.field[dataKey] !== undefined) {
        return this.field[dataKey];
      }
    }

    return false;
  },

  type: 'ctJSONField',
};
