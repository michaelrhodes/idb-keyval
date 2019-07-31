var queue = require('dexy')()
var kvs = require('./index')
var assert = console.assert

queue(function (next) {
  kvs.get('key', function (err, val) {
    assert(err === null, 'err is null')
    assert(val === void 0, 'val is undefined')
    next()
  })
})

queue(function (next) {
  kvs.set('key', { val: 'val' }, function (err, key) {
    assert(err === null, 'err is null')
    assert(key === 'key', 'key is key')
    next()
  })
})

queue(function (next) {
  kvs.get('key', function (err, val) {
    assert(err === null, 'err is null')
    assert(typeof val === 'object', 'val is object')
    assert(val.val === 'val', 'val.val is val')
    next()
  })
})

queue(function (done) {
  kvs.remove('key', function (err) {
    assert(err === null, 'err is null')
    done()
  })
})
