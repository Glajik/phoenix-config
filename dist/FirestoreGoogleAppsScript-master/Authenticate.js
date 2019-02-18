'use strict';

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "_" }] */
/* global FirestoreRequest_, Utilities, base64EncodeSafe_ */

/**
 * Auth token is formatted to {@link https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests}
 *
 * @private
 * @param email the database service account email address
 * @param key the database service account private key
 * @param authUrl the authorization url
 * @returns {string} the access token needed for making future requests
 */
function getAuthToken_(email, key, authUrl) {
  var jwt = createJwt_(email, key, authUrl);

  var options = {
    payload: 'grant_type=' + decodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer') + '&assertion=' + jwt
  };
  var responseObj = new FirestoreRequest_(authUrl, null, options).post();
  return responseObj.access_token;
}

/**
 * Creates the JSON Web Token for OAuth 2.0
 *
 * @private
 * @param email the database service account email address
 * @param key the database service account private key
 * @param authUrl the authorization url
 * @returns {string} JWT to utilize
 */
function createJwt_(email, key, authUrl) {
  var jwtHeader = {
    'alg': 'RS256',
    'typ': 'JWT'
  };

  var now = new Date();
  var nowSeconds = now.getTime() / 1000;

  now.setHours(now.getHours() + 1);
  var oneHourFromNowSeconds = now.getTime() / 1000;

  var jwtClaim = {
    'iss': email,
    'scope': 'https://www.googleapis.com/auth/datastore',
    'aud': authUrl,
    'exp': oneHourFromNowSeconds,
    'iat': nowSeconds
  };

  var jwtHeaderBase64 = base64EncodeSafe_(JSON.stringify(jwtHeader));
  var jwtClaimBase64 = base64EncodeSafe_(JSON.stringify(jwtClaim));

  var signatureInput = jwtHeaderBase64 + '.' + jwtClaimBase64;

  var signature = Utilities.computeRsaSha256Signature(signatureInput, key);
  var encodedSignature = base64EncodeSafe_(signature);

  return signatureInput + '.' + encodedSignature;
}