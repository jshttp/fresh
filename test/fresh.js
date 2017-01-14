
var assert = require('assert');
var fresh = require('..');

describe('fresh(reqHeader, resHeader)', function(){
  describe('when a non-conditional GET is performed', function(){
    it('should be stale', function(){
      var req = {};
      var res = {};
      assert.ok(!fresh(req, res));
    })
  })

  describe('when requested with If-None-Match', function(){
    describe('when ETags match', function(){
      it('should be fresh', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = { 'etag': 'tobi' };
        assert.ok(fresh(req, res));
      })
    })

    describe('when ETags mismatch', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = { 'etag': 'luna' };
        assert.ok(!fresh(req, res));
      })
    })

    describe('when etag is missing', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = {};
        assert.ok(!fresh(req, res));
      })
    })

    describe('when ETag is weak', function () {
      it('should be fresh on exact match', function () {
        var req = { 'if-none-match': 'W/"foo"' };
        var res = { 'etag': 'W/"foo"' };
        assert.ok(fresh(req, res));
      })

      it('should be fresh on strong match', function () {
        var req = { 'if-none-match': 'W/"foo"' };
        var res = { 'etag': '"foo"' };
        assert.ok(fresh(req, res));
      })
    })

    describe('when ETag is strong', function () {
      it('should be fresh on exact match', function () {
        var req = { 'if-none-match': '"foo"' };
        var res = { 'etag': '"foo"' };
        assert.ok(fresh(req, res));
      })

      it('should be stale on weak match', function () {
        var req = { 'if-none-match': '"foo"' };
        var res = { 'etag': 'W/"foo"' };
        assert.ok(!fresh(req, res));
      })
    })

    describe('when * is given', function(){
      it('should be fresh', function(){
        var req = { 'if-none-match': '*' };
        var res = { 'etag': 'hey' };
        assert.ok(fresh(req, res));
      })
    })
  })

  describe('when requested with If-Modified-Since', function(){
    describe('when modified since the date', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'last-modified': new Date(now - 2000).toUTCString() };
        assert.ok(!fresh(req, res));
      })
    })

    describe('when unmodified since the date', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = { 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'last-modified': new Date(now - 4000).toUTCString() };
        assert.ok(fresh(req, res));
      })
    })

    describe('when last-modified is missing', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': new Date().toUTCString() };
        var res = {};
        assert.ok(!fresh(req, res));
      })
    })
    
    describe('with invalid if-modified-since date', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'foo' };
        var res = {};
        assert.ok(!fresh(req, res));
      })
    })

    describe('with invalid modified-since date', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': new Date().toUTCString() };
        var res = { 'modified-since': 'foo' };
        assert.ok(!fresh(req, res));
      })
    })
  })

  describe('when requested with If-Modified-Since and If-None-Match', function(){
    describe('when both match', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'etag': 'tobi', 'last-modified': new Date(now - 4000).toUTCString() };
        assert.ok(fresh(req, res));
      })
    })

    describe('when only one matches', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'etag': 'tobi', 'last-modified': new Date(now - 2000).toUTCString() };
        assert.ok(!fresh(req, res));

        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'etag': 'luna', 'last-modified': new Date(now - 4000).toUTCString() };
        assert.ok(!fresh(req, res));
      })
    })

    describe('when none match', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'etag': 'luna', 'last-modified': new Date(now - 2000).toUTCString() };
        assert.ok(!fresh(req, res));
      })
    })
  })

  describe('when requested with Cache-Control: no-cache', function(){
    it('should be stale', function(){
      var req = { 'cache-control' : ' no-cache' };
      var res = {};
      assert.ok(!fresh(req, res));
    })
  })

  describe('when response headers are stored as an array', function(){
    it('should find the correct values', function(){
      var req = { 'if-none-match': '12345' };
      var res = { 'etag': ['ETag', '12345'] };
      assert.ok(fresh(req, res));

      var now = new Date;
      var req = { 'if-modified-since': new Date(now - 2000).toUTCString() };
      var res = { 'last-modified': ['Last-Modified', new Date(now - 4000).toUTCString() ] };
      assert.ok(fresh(req, res));
    })
  })
})
