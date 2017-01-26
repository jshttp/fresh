/*!
 * fresh
 * Copyright(c) 2012 TJ Holowaychuk
 * MIT Licensed
 */

'use strict';

/**
 * Simple expression to split token list.
 * @private
 */

var TOKEN_LIST_REGEXP = / *, */

/**
 * Module exports.
 * @public
 */

module.exports = fresh;

/**
 * Check freshness of the response using request and response headers.
 *
 * @param {Object} reqHeaders
 * @param {Object} resHeaders
 * @return {Boolean}
 * @public
 */

function fresh (reqHeaders, resHeaders) {
  // defaults
  var etagMatches = true;
  var notModified = true;

  // fields
  var modifiedSince = reqHeaders['if-modified-since']
  var noneMatch = reqHeaders['if-none-match']
  var lastModified = resHeaders['last-modified']
  var etag = resHeaders['etag']
  var cc = reqHeaders['cache-control']

  // unconditional request
  if (!modifiedSince && !noneMatch) return false;

  // check for no-cache cache request directive
  if (cc && cc.indexOf('no-cache') !== -1) return false;  

  // parse if-none-match
  if (noneMatch) {
    noneMatch = noneMatch.split(TOKEN_LIST_REGEXP)
  }

  // if-none-match
  if (noneMatch) {
    etagMatches = noneMatch.some(function (match) {
      return match === '*' || match === etag || match === 'W/' + etag;
    });
  }

  // if-modified-since
  if (modifiedSince) {
    modifiedSince = new Date(modifiedSince);
    lastModified = new Date(lastModified);
    notModified = lastModified <= modifiedSince;
  }

  return !! (etagMatches && notModified);
}
