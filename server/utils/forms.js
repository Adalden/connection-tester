/* jshint node:true */
'use strict';

function shallowVerifyFields(obj, fields) {
  for (var i = 0; i < fields.length; ++i) {
    if (!(fields[i] in obj)) {
      return fields[i];
    }
  }
  return false;
}

module.exports = {
  verifyFields: shallowVerifyFields
};
