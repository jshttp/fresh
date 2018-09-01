
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
  name: 'not modified',
  minSamples: 100,
  fn: 'var val = fresh({ \'if-modified-since\': \'Fri, 01 Jan 2010 00:00:00 GMT\' }, { \'last-modified\': \'Sat, 01 Jan 2000 00:00:00 GMT\' })'
})

suite.add({
  name: 'modified',
  minSamples: 100,
  fn: 'var val = fresh({ \'if-modified-since\': \'Mon, 01 Jan 1990 00:00:00 GMT\' }, { \'last-modified\': \'Sat, 01 Jan 2000 00:00:00 GMT\' })'
})

suite.on('start', function onCycle (event) {
  process.stdout.write('  modified\n\n')
})

suite.on('cycle', function onCycle (event) {
  benchmarks.add(event.target)
})

suite.on('complete', function onComplete () {
  benchmarks.log()
})

suite.run({ async: false })
