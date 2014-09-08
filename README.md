
# fresh

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

  HTTP response freshness testing

## fresh(req, res)

 Check freshness of `req` and `res` headers.

 When the cache is "fresh" __true__ is returned,
 otherwise __false__ is returned to indicate that
 the cache is now stale.

## Example:

```js
var req = { 'if-none-match': 'tobi' };
var res = { 'etag': 'luna' };
fresh(req, res);
// => false

var req = { 'if-none-match': 'tobi' };
var res = { 'etag': 'tobi' };
fresh(req, res);
// => true
```

## Installation

```
$ npm install fresh
```

[npm-image]: https://img.shields.io/npm/v/fresh.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fresh
[github-tag]: http://img.shields.io/github/tag/jshttp/fresh.svg?style=flat-square
[github-url]: https://github.com/jshttp/fresh/tags
[travis-image]: https://img.shields.io/travis/jshttp/fresh.svg?style=flat-square
[travis-url]: https://travis-ci.org/jshttp/fresh
[coveralls-image]: https://img.shields.io/coveralls/jshttp/fresh.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jshttp/fresh?branch=master
[david-image]: http://img.shields.io/david/jshttp/fresh.svg?style=flat-square
[david-url]: https://david-dm.org/jshttp/fresh
[license-image]: http://img.shields.io/npm/l/fresh.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/fresh.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/fresh
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
