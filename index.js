module.exports = {
  clear: clear,
  remove: remove,
  get: get,
  set: set
}

var db

function get (key, cb) {
  transaction(function (store) {
    op(store.get(key), cb)
  }, cb)
}

function set (key, val, cb) {
  transaction(function (store) {
    op(store.put(val, key), cb)
  }, cb)
}

function remove (key, cb) {
  transaction(function (store) {
    op(store.delete(key), cb)
  }, cb)
}

function clear (cb) {
  transaction(function (store) {
    op(store.clear(), cb)
  }, cb)
}

function transaction (yes, no) {
  open(function (db) {
    yes(db.transaction('kv', 'readwrite')
      .objectStore('kv'))
  }, no)
}

function open (yes, no) {
  if (db) return yes(db)

  var idb = indexedDB.open('kvs')

  idb.onupgradeneeded = function () {
    idb.result.createObjectStore('kv')
  }

  op(idb, function (err) {
    err ? no(err) : yes(db = idb.result)
  })
}

function op (req, cb) {
  cb = cb || noop
  req.onerror = cb
  req.onsuccess = function () {
    cb(null, req.result)
  }
}

function noop () {}
