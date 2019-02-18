'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Helper = {
  makeObjectFromValues: function makeObjectFromValues(values, fields) {
    return fields.reduce(function (acc, field, index) {
      return _extends({}, acc, _defineProperty({}, field, values[index]));
    }, {});
  },

  makeValuesFromObject: function makeValuesFromObject(object, fields) {
    return fields.map(function (field) {
      return object[field] || '';
    });
  },

  find: function find(key, array) {
    return array.reduce(function (acc, value, index) {
      return acc >= 0 || value !== key ? acc : index;
    }, -1);
  },

  has: function has(key, array) {
    return array.some(function (value) {
      return value === key;
    });
  },

  hasInObject: function hasInObject(value, object) {
    return Object.keys(object).some(function (prop) {
      return object[prop] === value;
    });
  },

  convertToObjectColl: function convertToObjectColl(valuesColl, fields) {
    return valuesColl.map(function (values) {
      return Helper.makeObjectFromValues(values, fields);
    });
  },
  convertToValuesColl: function convertToValuesColl(objectColl, fields) {
    return objectColl.map(function (obj) {
      return Helper.makeValuesFromObject(obj, fields);
    });
  },

  regexpColl: {
    folderId: /^(?:https:\/\/)(?:drive.google.com\/drive\/folders\/)([\d\w-]+)$/,
    // fileId: /^(?:https:\/\/drive\.google\.com\/open\?id=)([\w-]{33})$/,
    fileId: /^(?:https:\/\/drive\.google\.com\/file\/d\/)([\w-]{33})(?:\/[\w=?]*)$/
  },

  isFolderUrl: function isFolderUrl(url) {
    return Helper.regexpColl.folderId.test(url);
  },
  getFolderIdFromUrl: function getFolderIdFromUrl(url) {
    return Helper.regexpColl.folderId.exec(url)[1];
  },

  isFileUrl: function isFileUrl(url) {
    return Helper.regexpColl.fileId.test(url);
  },
  getFileIdFromUrl: function getFileIdFromUrl(url) {
    return Helper.regexpColl.fileId.exec(url)[1];
  },

  makeUrlFromFileId: function makeUrlFromFileId(fileId) {
    return 'https://drive.google.com/file/d/' + fileId + '/view';
  },

  loggerLogAllProps: function loggerLogAllProps(o) {
    return Object.keys(o).forEach(function (key) {
      return Logger.log(key + ' = ' + o[key] + ', ' + _typeof(o[key]));
    });
  },

  partialDeepEqual: function partialDeepEqual(compObj, refObj) {
    return Object.keys(compObj).map(function (prop) {
      return refObj[prop] && refObj[prop] == compObj[prop];
    }).reduce(function (acc, boolValue) {
      return acc && boolValue;
    }, true);
  },

  hasAllPropertiesInList: function hasAllPropertiesInList(objColl, keys) {
    return keys.map(function (prop) {
      return objColl[prop] && true;
    }).reduce(function (acc, boolValue) {
      return acc && boolValue;
    }, true);
  }
};