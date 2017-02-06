/*!
 * fresh
 * Copyright(c) 2012 TJ Holowaychuk
 * Copyright(c) 2016-2017 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict'

/**
 * RegExp to check for no-cache token in Cache-Control.
 * @private
 */

var CACHE_CONTROL_NO_CACHE_REGEXP = /(?:^|,)\s*?no-cache\s*?(?:,|$)/

/**
 * Simple expression to split token list.
 * @private
 */

var TOKEN_LIST_REGEXP = / *, */

/**
 * Module exports.
 * @public
 */

module.exports = fresh

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
  var etagMatches = true
  var notModified = true

  // fields
  var cacheControl = reqHeaders['cache-control']
  var modifiedSince = reqHeaders['if-modified-since']
  var noneMatch = reqHeaders['if-none-match']
  var lastModified = resHeaders['last-modified']
  var etag = resHeaders['etag']

  // unconditional request
  if (!modifiedSince && !noneMatch) {
    return false
  }

  // Always return stale when Cache-Control: no-cache
  // to support end-to-end reload requests
  // https://tools.ietf.org/html/rfc2616#section-14.9.4
  if (cacheControl && CACHE_CONTROL_NO_CACHE_REGEXP.test(cacheControl)) {
    return false
  }

  // if-none-match
  if (noneMatch) {
    noneMatch = noneMatch.split(TOKEN_LIST_REGEXP)
    etagMatches = noneMatch.some(function (match) {
      return match === '*' || match === etag || match === 'W/' + etag
    })
  }

  // if-modified-since
  if (modifiedSince) {
    modifiedSince = new Date(modifiedSince)
    lastModified = new Date(lastModified)
    notModified = lastModified <= modifiedSince
  }

  return etagMatches && notModified
}
