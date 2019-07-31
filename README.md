# idb-kvs
a fork of an old version of [jakearchibald/idb-keyval](https://github.com/jakearchibald/idb-keyval) that uses callbacks instead of promises

## Install

```sh
npm install michaelrhodes/idb-kvs
```

## Usage

```js
kvs.set('hello', 'world')
kvs.set('foo', 'bar')

// Since this is IDB-backed, you can store
// anything structured/clonable (numbers,
// arrays, objects, dates, blobs etc)

kvs.set('hello', { person: 'newman' }, function (err, key) {
  console.log(err ? 'It failed!' : 'It worked!')
})

kvs.get('hello', function (err, val) {
  console.log(val)
  => { person: 'newman' }
})

kvs.remove('hello')
kvs.clear()
```
