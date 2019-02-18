'use strict';

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */
/* globals createFirestoreDocument_, getDocumentFromPath_ */

/**
 * Create a document with the given ID and fields.
 *
 * @private
 * @param {string} path the path where the document will be written
 * @param {string} documentId the document's ID in Firestore
 * @param {object} fields the document's fields
 * @param {string} request the Firestore Request object to manipulate
 * @return {object} the Document object written to Firestore
 */
function createDocument_(path, fields, request) {
  var pathDoc = getDocumentFromPath_(path);
  var firestoreObject = createFirestoreDocument_(fields);
  var documentId = pathDoc[1];

  if (documentId) {
    request.addParam('documentId', documentId);
  }
  return request.post(pathDoc[0], firestoreObject);
}

/**
 * Update/patch a document at the given path with new fields.
 *
 * @private
 * @param {string} path the path of the document to update
 * @param {object} fields the document's new fields
 * @param {string} request the Firestore Request object to manipulate
 * @param {boolean} if true, the update will use a mask
 * @return {object} the Document object written to Firestore
 */
function updateDocument_(path, fields, request, mask) {
  if (mask) {
    // abort request if fields object is empty
    if (!Object.keys(fields).length) {
      return;
    }
    for (field in fields) {
      request.addParam('updateMask.fieldPaths', field);
    }
  }

  var firestoreObject = createFirestoreDocument_(fields);

  return request.patch(path, firestoreObject);
}