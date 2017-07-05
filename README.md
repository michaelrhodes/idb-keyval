# idb-kvs

This is a fork of [jakearchibald/idb-keyval](https://github.com/jakearchibald/idb-keyval) that uses callbacks instead of promises. It’s essentially an async localStorage, backed by IndexedDB.

## Install

```sh
npm install idb-kvs
```

## Usage

```js
kvs.set('hello', 'world')
kvs.set('foo', 'bar')

// Since this is IDB-backed, you can store
// anything structured/clonable (numbers,
// arrays, objects, dates, blobs etc)

kvs.set('hello', 'newman', function (err, key) {
  console.log(err ? 'It failed!' : 'It worked!')
})

kvs.get('hello', function (err, val) {
  console.log(val)
  => 'world'
})

kvs.keys(function (err, keys) {
  console.log(keys)
  => ['hello', 'foo']
})

kvs.delete('hello')
kvs.clear()
```
