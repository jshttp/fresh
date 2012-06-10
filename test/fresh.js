
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

    xdescribe('when etag is missing');
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

    xdescribe('with invalid if-modified-since date');
    xdescribe('with invalid modified-since date');
    xdescribe('when last-modified is missing');
  })
})