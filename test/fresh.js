
var assert = require('assert')
var fresh = require('..')

describe('fresh(reqHeaders, resHeaders)', function () {
  describe('when a non-conditional GET is performed', function () {
    it('should be stale', function () {
      var reqHeaders = {}
      var resHeaders = {}
      assert.ok(!fresh(reqHeaders, resHeaders))
    })
  })

  describe('when requested with If-None-Match', function () {
    describe('when ETags match', function () {
      it('should be fresh', function () {
        var reqHeaders = { 'if-none-match': '"foo"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when ETags mismatch', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-none-match': '"foo"' }
        var resHeaders = { etag: '"bar"' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when at least one matches', function () {
      it('should be fresh', function () {
        var reqHeaders = { 'if-none-match': ' "bar" , "foo"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when etag is missing', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-none-match': '"foo"' }
        var resHeaders = {}
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when ETag is weak', function () {
      it('should be fresh on exact match', function () {
        var reqHeaders = { 'if-none-match': 'W/"foo"' }
        var resHeaders = { etag: 'W/"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })

      it('should be fresh on strong match', function () {
        var reqHeaders = { 'if-none-match': 'W/"foo"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when ETag is strong', function () {
      it('should be fresh on exact match', function () {
        var reqHeaders = { 'if-none-match': '"foo"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })

      it('should be fresh on weak match', function () {
        var reqHeaders = { 'if-none-match': '"foo"' }
        var resHeaders = { etag: 'W/"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when * is given', function () {
      it('should be fresh', function () {
        var reqHeaders = { 'if-none-match': '*' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })

      it('should get ignored if not only value', function () {
        var reqHeaders = { 'if-none-match': '*, "bar"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })
  })

  describe('when requested with If-Modified-Since', function () {
    describe('when modified since the date', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        var resHeaders = { 'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when unmodified since the date', function () {
      it('should be fresh', function () {
        var reqHeaders = { 'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        var resHeaders = { 'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when Last-Modified is missing', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        var resHeaders = {}
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('with invalid If-Modified-Since date', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-modified-since': 'foo' }
        var resHeaders = { 'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('with invalid Last-Modified date', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        var resHeaders = { 'last-modified': 'foo' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })
  })

  describe('when requested with If-Modified-Since and If-None-Match', function () {
    describe('when both match', function () {
      it('should be fresh', function () {
        var reqHeaders = { 'if-none-match': '"foo"', 'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        var resHeaders = { etag: '"foo"', 'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        assert.ok(fresh(reqHeaders, resHeaders))
      })
    })

    describe('when only ETag matches', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-none-match': '"foo"', 'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        var resHeaders = { etag: '"foo"', 'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when only Last-Modified matches', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-none-match': '"foo"', 'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        var resHeaders = { etag: '"bar"', 'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when none match', function () {
      it('should be stale', function () {
        var reqHeaders = { 'if-none-match': '"foo"', 'if-modified-since': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        var resHeaders = { etag: '"bar"', 'last-modified': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })
  })

  describe('when requested with Cache-Control: no-cache', function () {
    it('should be stale', function () {
      var reqHeaders = { 'cache-control': ' no-cache' }
      var resHeaders = {}
      assert.ok(!fresh(reqHeaders, resHeaders))
    })

    describe('when ETags match', function () {
      it('should be stale', function () {
        var reqHeaders = { 'cache-control': ' no-cache', 'if-none-match': '"foo"' }
        var resHeaders = { etag: '"foo"' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })

    describe('when unmodified since the date', function () {
      it('should be stale', function () {
        var reqHeaders = { 'cache-control': ' no-cache', 'if-modified-since': 'Sat, 01 Jan 2000 01:00:00 GMT' }
        var resHeaders = { 'last-modified': 'Sat, 01 Jan 2000 00:00:00 GMT' }
        assert.ok(!fresh(reqHeaders, resHeaders))
      })
    })
  })
})
