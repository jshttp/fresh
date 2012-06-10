
var fresh = require('..');

describe('fresh(reqHeader, resHeader)', function(){
  describe('when a non-conditional GET is performed', function(){
    it('should be stale', function(){
      var req = {};
      var res = {};
      fresh(req, res).should.be.false;
    })
  })

  describe('when requested with If-None-Match', function(){
    describe('when ETags match', function(){
      it('should be fresh', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = { 'etag': 'tobi' };
        fresh(req, res).should.be.true;
      })
    })

    describe('when ETags mismatch', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = { 'etag': 'luna' };
        fresh(req, res).should.be.false;
      })
    })

    describe('when etag is missing', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'tobi' };
        var res = {};
        fresh(req, res).should.be.false;
      })
    })
  })

  describe('when requested with If-Modified-Since', function(){
    describe('when modified since the date', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'last-modified': new Date(now - 2000).toUTCString() };
        fresh(req, res).should.be.false;
      })
    })

    describe('when unmodified since the date', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = { 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'last-modified': new Date(now - 4000).toUTCString() };
        fresh(req, res).should.be.true;
      })
    })

    describe('when last-modified is missing', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': new Date().toUTCString() };
        var res = {};
        fresh(req, res).should.be.false;
      })
    })
    
    describe('with invalid if-modified-since date', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': 'foo' };
        var res = {};
        fresh(req, res).should.be.false;
      })
    })

    describe('with invalid modified-since date', function(){
      it('should be stale', function(){
        var req = { 'if-none-match': new Date().toUTCString() };
        var res = { 'modified-since': 'foo' };
        fresh(req, res).should.be.false;
      })
    })
  })

  describe('when requested with If-Modified-Since and If-None-Match', function(){
    describe('when both match', function(){
      it('should be fresh', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'etag': 'tobi', 'last-modified': new Date(now - 4000).toUTCString() };
        fresh(req, res).should.be.true;
      })
    })

    describe('when only one matches', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'etag': 'tobi', 'last-modified': new Date(now - 2000).toUTCString() };
        fresh(req, res).should.be.false;

        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 2000).toUTCString() };
        var res = { 'etag': 'luna', 'last-modified': new Date(now - 4000).toUTCString() };
        fresh(req, res).should.be.false;
      })
    })

    describe('when none match', function(){
      it('should be stale', function(){
        var now = new Date;
        var req = { 'if-none-match': 'tobi', 'if-modified-since': new Date(now - 4000).toUTCString() };
        var res = { 'etag': 'luna', 'last-modified': new Date(now - 2000).toUTCString() };
        fresh(req, res).should.be.false;
      })
    })
  })
})