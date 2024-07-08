var QueryUtils = Class.create();
QueryUtils.prototype = {
  initialize: function () {},

  _getFieldName: function (query) {
    var LOG = 'Edward - QueryUtils - _getFieldName';
    query = query.replace('OR', '');
    query = query.replace('NQ', '');
    LOG += '\nquery: ' + query;
    var conditions = [
      '=',
      '!=',
      '<',
      '<=',
      '>',
      '>=',
      'ISEMPTY',
      'ISNOTEMPTY',
      'STARTSWITH',
      'ENDSWITH',
      'LIKE',
      'NOTLIKE',
      'ANYTHING',
      'SAMEAS',
      'NSAMEAS',
      'EMPTYSTRING',
      'ON',
      'NOTON',
      'NOT IN',
      'IN',
      'BETWEEN',
      'DATEPART',
      'RELATIVE',
      'MORETHAN',
      'LESSTHAN',
      'MATCH_PAT',
      'MATCH_RGX',
      'DYNAMIC',
    ];

    for (var i = 0; i < conditions.length; i++) {
      var search = new RegExp(conditions[i] + '.*$');
      var match = query.match(search);
      LOG += '\n ' + i + ' : search: ' + search + ' | match: ' + match;
      if (match != null) {
        return query.replace(search, '');
      }
    }
    //gs.log(LOG);
  },

  _removeDuplicates: function (arr) {
    uniqueFields = [];
    for (var i = 0; i < arr.length; i++) {
      if (uniqueFields.indexOf(arr[i]) === -1) {
        uniqueFields.push(arr[i]);
      }
    }
    return uniqueFields;
  },

  getFieldsFromQuery: function (query) {
    var LOG = 'Edward - QueryUtils - getFieldsFromQuery';
    LOG += '\nquery: ' + query;
    var fields = [];
    var eq = query.replace('^EQ', '').split('^');
    LOG += '\neq: ' + eq;
    LOG += '\neq.length: ' + eq.length;
    for (var i = 0; i < eq.length; i++) {
      var field = this._getFieldName(eq[i]);
      LOG += '\n ' + i + ' : field:' + field;
      if (field != 'undefined') fields.push(field);
    }

    //gs.log(LOG);
    return this._removeDuplicates(fields);
  },

  getCommonFields: function (arr1, arr2) {
    var commonFields = arr1.filter(function (v) {
      return arr2.indexOf(v) >= 0;
    });
    commonFields.concat(
      arr2.filter(function (v) {
        return commonFields.indexOf(v) >= 0;
      })
    );

    return this._removeDuplicates(commonFields);
  },

  type: 'QueryUtils',
};
