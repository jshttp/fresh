
var assert = require('assert');
var util = require('util');
var http = require('http');
var fresh = require('..');

function Request(headers) {
  http.IncomingMessage.call(this);
  if (headers) {
    this.headers = headers;
  }
}

function Response(headers) {
  http.OutgoingMessage.call(this);
  if (headers) {
    this._headers = headers;
  }
}

util.inherits(Request, http.IncomingMessage);
util.inherits(Response, http.OutgoingMessage);

describe('fresh(reqHeader, resHeader)', function(){
  describe('when a non-conditional GET is performed', function(){
    it('should be stale', function(){
      var req = new Request();
      var res = new Response();
      assert.ok(!fresh(req, res));
    })
  })

  describe('when requested with If-None-Match', function(){
    describe('when ETags match', function(){
      it('should be fresh', function(){
        var req = new Request({ 'if-none-match': 'tobi' });
        var res = new Response({ 'etag': 'tobi' });
        assert.ok(fresh(req, res));
      })
    })

    describe('when ETags mismatch', function(){
      it('should be stale', function(){
        var req = new Request({ 'if-none-match': 'tobi' });
        var res = new Response({ 'etag': 'luna' });
        assert.ok(!fresh(req, res));
      })
    })

    describe('when etag is missing', function(){
      it('should be stale', function(){
        var req = new Request({ 'if-none-match': 'tobi' });
        var res = new Response({});
        assert.ok(!fresh(req, res));
      })
    })

    describe('when ETag is weak', function () {
      it('should be fresh on exact match', function () {
        var req = new Request({ 'if-none-match': 'W/"foo"' });
        var res = new Response({ 'etag': 'W/"foo"' });
        assert.ok(fresh(req, res));
      })

      it('should be fresh on strong match', function () {
        var req = new Request({ 'if-none-match': 'W/"foo"' });
        var res = new Response({ 'etag': '"foo"' });
        assert.ok(fresh(req, res));
      })
    })

    describe('when ETag is strong', function () {
      it('should be fresh on exact match', function () {
        var req = new Request({ 'if-none-match': '"foo"' });
        var res = new Response({ 'etag': '"foo"' });
        assert.ok(fresh(req, res));
      })

      it('should be stale on weak match', function () {
        var req = new Request({ 'if-none-match': '"foo"' });
        var res = new Response({ 'etag': 'W/"foo"' });
        assert.ok(!fresh(req, res));
      })
    })

    describe('when * is given', function(){
      it('should be fresh', function(){
        var req = new Request({ 'if-none-match': '*' });
        var res = new Response({ 'etag': 'hey' });
        assert.ok(fresh(req, res));
      })
    })
  })

  describe('when requested with If-Modified-Since', function(){
    describe('when modified since the date', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = new Request({ 'if-modified-since': new Date(now - 4000).toUTCString() });
        var res = new Response({ 'last-modified': new Date(now - 2000).toUTCString() });
        assert.ok(!fresh(req, res));
      })
    })

    describe('when unmodified since the date', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = new Request({ 'if-modified-since': new Date(now - 2000).toUTCString() });
        var res = new Response({ 'last-modified': new Date(now - 4000).toUTCString() });
        assert.ok(fresh(req, res));
      })
    })

    describe('when last-modified is missing', function(){
      it('should be stale', function(){
        var req = new Request({ 'if-none-match': new Date().toUTCString() });
        var res = new Response({});
        assert.ok(!fresh(req, res));
      })
    })

    describe('with invalid if-modified-since date', function(){
      it('should be stale', function(){
        var req = new Request({ 'if-none-match': 'foo' });
        var res = new Response();
        assert.ok(!fresh(req, res));
      })
    })

    describe('with invalid modified-since date', function(){
      it('should be stale', function(){
        var req = new Request({ 'if-none-match': new Date().toUTCString() });
        var res = new Response({ 'modified-since': 'foo' });
        assert.ok(!fresh(req, res));
      })
    })
  })

  describe('when requested with If-Modified-Since and If-None-Match', function(){
    describe('when both match', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = new Request({ 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() });
        var res = new Response({ 'etag': 'tobi', 'last-modified': new Date(now - 4000).toUTCString() });
        assert.ok(fresh(req, res));
      })
    })

    describe('when only one matches', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = new Request({ 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() });
        var res = new Response({ 'etag': 'tobi', 'last-modified': new Date(now - 2000).toUTCString() });
        assert.ok(!fresh(req, res));

        var now = new Date;
        var req = new Request({ 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() });
        var res = new Response({ 'etag': 'luna', 'last-modified': new Date(now - 4000).toUTCString() });
        assert.ok(!fresh(req, res));
      })
    })

    describe('when none match', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = new Request({ 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() });
        var res = new Response({ 'etag': 'luna', 'last-modified': new Date(now - 2000).toUTCString() });
        assert.ok(!fresh(req, res));
      })
    })
  })

  describe('when requested with Cache-Control: no-cache', function(){
    it('should be stale', function(){
      var req = new Request({ 'cache-control' : ' no-cache' });
      var res = new Request();
      assert.ok(!fresh(req, res));
    })
  })
})
