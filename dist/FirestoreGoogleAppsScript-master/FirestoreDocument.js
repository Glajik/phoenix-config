'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */
/* globals isInt_, regexPath_, regexBinary_ */

/**
 * Create a Firestore documents with the corresponding fields.
 *
 * @param {object} fields the document's fields
 * @return {object} a Firestore document with the given fields
 */
function createFirestoreDocument_(fields) {
  var keys = Object.keys(fields);
  var fieldsObj = keys.reduce(function (o, key) {
    o[key] = wrapValue_(fields[key]);
    return o;
  }, {});

  return { fields: fieldsObj };
}

/**
 * Extract fields from a Firestore document.
 *
 * @param {object} firestoreDoc the Firestore document whose fields will be extracted
 * @return {object} an object with the given document's fields and values
 */
function getFieldsFromFirestoreDocument_(firestoreDoc) {
  if (!firestoreDoc || !firestoreDoc['fields']) {
    return {};
  }

  var fields = firestoreDoc['fields'];
  var keys = Object.keys(fields);
  var object = keys.reduce(function (o, key) {
    o[key] = unwrapValue_(fields[key]);
    return o;
  }, {});

  return object;
}

/**
 * Unwrap the given document response's fields.
 *
 * @private
 * @param docResponse the document response
 * @return the document response, with unwrapped fields
 */
function unwrapDocumentFields_(docResponse) {
  if (docResponse.fields) {
    docResponse.fields = getFieldsFromFirestoreDocument_(docResponse);
  }
  return docResponse;
}

function wrapValue_(value) {
  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  switch (type) {
    case 'string':
      return wrapString_(value);
    case 'object':
      return wrapObject_(value);
    case 'number':
      return wrapNumber_(value);
    case 'boolean':
      return wrapBoolean_(value);
    default:
      // error
      return null;
  }
}

function unwrapValue_(value) {
  var type = Object.keys(value)[0];
  value = value[type];
  switch (type) {
    case 'referenceValue':
    case 'bytesValue':
    case 'stringValue':
    case 'booleanValue':
    case 'doubleValue':
      return value;
    case 'integerValue':
      return parseInt(value);
    case 'geoPointValue':
      value = createFirestoreDocument_(value);
    // Transform coordinates as mapValue object type
    // fall through
    case 'mapValue':
      return getFieldsFromFirestoreDocument_(value);
    case 'arrayValue':
      return unwrapArray_(value['values']);
    case 'timestampValue':
      return new Date(value);
    case 'nullValue':
    default:
      // error
      return null;
  }
}

function wrapString_(string) {
  // Test for root path reference inclusion (see Util.js)
  if (regexPath_.test(string)) {
    return wrapRef_(string);
  }

  // Test for binary data in string (see Util.js)
  if (regexBinary_.test(string)) {
    return wrapBytes_(string);
  }

  return { 'stringValue': string };
}

function wrapObject_(object) {
  if (!object) {
    return wrapNull_();
  }

  if (Array.isArray(object)) {
    return wrapArray_(object);
  }

  if (object instanceof Date) {
    return wrapDate_(object);
  }

  if (Object.keys(object).length === 2 && 'latitude' in object && 'longitude' in object) {
    return wrapLatLong_(object);
  }

  return { 'mapValue': createFirestoreDocument_(object) };
}

function wrapNull_() {
  return { 'nullValue': null };
}

function wrapBytes_(bytes) {
  return { 'bytesValue': bytes };
}

function wrapRef_(ref) {
  return { 'referenceValue': ref };
}

function wrapNumber_(num) {
  if (isInt_(num)) {
    return wrapInt_(num);
  } else {
    return wrapDouble_(num);
  }
}

function wrapInt_(int) {
  return { 'integerValue': int };
}

function wrapDouble_(double) {
  return { 'doubleValue': double };
}

function wrapBoolean_(boolean) {
  return { 'booleanValue': boolean };
}

function wrapDate_(date) {
  return { 'timestampValue': date };
}

function wrapLatLong_(latLong) {
  return { 'geoPointValue': latLong };
}

function wrapArray_(array) {
  var wrappedArray = array.map(wrapValue_);
  return { 'arrayValue': { 'values': wrappedArray } };
}

function unwrapArray_(wrappedArray) {
  var array = (wrappedArray || []).map(unwrapValue_);
  return array;
}