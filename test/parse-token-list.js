
var assert = require('assert')
var parseTokenList = require('../parse-token-list')

describe('parseTokenList(str)', function () {
  it('should ignore empty tokens', function () {
    const tokens = parseTokenList(' "foo",,"bar" ,')
    assert.deepEqual(tokens, [ '"foo"', '"bar"' ])
  })
})
