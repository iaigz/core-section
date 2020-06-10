const assert = require('assert').strict

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const Section = require('..')

const cases = [
  { slug: 'no-meta' },
  { slug: 'string-meta', meta: 'Dumb section' },
  { slug: 'null-meta', meta: null },
  { slug: 'object-meta', meta: { foo: 'bar', baz: 'omg' } }
]

cases.forEach((value, idx) => {
  let section = null
  try {
    section = new Section(value)
    console.log('PASS instance can be created with %s', value)
  } catch (err) {
    console.error(err.stack)
    console.error('value:', value)
    console.log('FAIL instances should be able to be created with %s', value)
    process.exit(1)
  }
  try {
    assert.deepEqual(section.meta, value.meta)
  } catch (err) {
    console.error(err.stack)
    console.error('value:', value)
    console.error('section.meta:', section.meta)
    console.log('FAIL Section#meta is not correct for case', idx)
    process.exit(1)
  }
  console.log('PASS Section#meta seems ok for case', idx)
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
