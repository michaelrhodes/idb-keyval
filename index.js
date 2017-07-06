var db

module.exports = {
  get: get,
  set: set,
  delete: del,
  clear: clear,
  keys: keys
}

function get (key, cb) {
  withStore('readonly', then(function (store) {
    handle(store.get(key), cb)
  }, cb))
}

function set (key, val, cb) {
  withStore('readwrite', then(function (store) {
    handle(store.put(val, key), cb)
  }, cb))
}

function del (key, cb) {
  withStore('readwrite', then(function (store) {
    handle(store.delete(key), cb)
  }, cb))
}

function clear (cb) {
  withStore('readwrite', then(function (store) {
    handle(store.clear(), cb)
  }, cb))
}

function keys (cb) {
  cb = cb || noop
  var keys = []
  withStore('readonly', then(function (store) {
    // This would be store.getAllKeys(), but it isn’t
    // supported by Edge or Safari — and openKeyCursor
    // isn’t supported by Safari.
    var req = (store.openKeyCursor || store.openCursor).call(store)
    req.onerror = cb
    req.onsuccess = function () {
      if (!req.result) return cb(null, keys)
      keys.push(req.result.key)
      req.result.continue()
    }
  }, cb))
}

function withStore (type, cb) {
  getDB(then(function (db) {
    var transaction = db.transaction('kv', type)
    transaction.onerror = cb
    cb(null, transaction.objectStore('kv'))
  }, cb))
}

function getDB (cb) {
  if (db) return cb(null, db)
  var open = indexedDB.open('kvs', 1)
  open.onerror = cb
  open.onupgradeneeded = function () {
    // First time setup: create an empty object store
    open.result.createObjectStore('kv')
  }
  open.onsuccess = function () {
    cb(null, db = open.result)
  }
}

function handle (req, cb) {
  cb = cb || noop
  req.onerror = cb
  req.onsuccess = function () {
    cb(null, req.result)
  }
}

function then (resolve, reject) {
  return function () {
    var args = [].slice.call(arguments)
    args[0] === null ?
      resolve.apply(null, args.slice(1)) :
      reject(args[0])
  }
}

function noop () {}
