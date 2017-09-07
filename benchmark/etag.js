
/**
 * Module dependencies.
 */

var benchmark = require('benchmark')
var benchmarks = require('beautify-benchmark')

/**
 * Globals for benchmark.js
 */

global.fresh = require('..')

var suite = new benchmark.Suite()

suite.add({
  name: 'star',
  minSamples: 100,
  fn: 'var val = fresh({ \'if-none-match\': \'*\' }, { etag: \'"foo"\' })'
})

suite.add({
  name: 'single etag',
  minSamples: 100,
  fn: 'var val = fresh({ \'if-none-match\': \'"foo"\' }, { etag: \'"foo"\' })'
})

suite.add({
  name: 'several etags',
  minSamples: 100,
  fn: 'var val = fresh({ \'if-none-match\': \'"foo", "bar", "fizz", "buzz"\' }, { etag: \'"buzz"\' })'
})

suite.on('start', function onCycle (event) {
  process.stdout.write('  etag\n\n')
})

suite.on('cycle', function onCycle (event) {
  benchmarks.add(event.target)
})

suite.on('complete', function onComplete () {
  benchmarks.log()
})

suite.run({async: false})
