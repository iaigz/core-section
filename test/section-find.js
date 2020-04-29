const assert = require('assert')

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const Section = require('..')

//
// Test function
//
function findTest (path, expect) {
  console.log(`DESC path as '${path}'`)
  let actual = null
  try {
    actual = Section.find(path)
  } catch (err) {
    console.log('FAIL Section.find should never throw')
    throw err
  }
  try {
    assert.strictEqual(actual, expect)
  } catch (err) {
    console.error('path:', path)
    console.error('actual:', actual)
    console.error('expect:', expect)
    console.log('FAIL Section.find(path) expected return mismatch')
    throw err
  }
  console.log('PASS Section.find(path) returns %s', expect)
}

//
// sections
//

const one = new Section({ slug: 'one' })
const two = new Section({ slug: 'two' })
const foo = new Section({ slug: 'foo' })

const sub = one.append({ slug: 'subsection' })
const sub2 = two.append({ slug: 'other' }).append({ slug: 'sub2' })
const f = foo.append({ slug: '1' }).append({ slug: '2' }).append({ slug: '3' })

//
// Tests
//
for (const [path, obj] of [
  ['/unexistant', null],
  ['/one', one],
  ['/one/subsection', sub],
  ['/one/unexistant', null],
  ['/two', two],
  ['/two/other/unexistant', null],
  ['/two/other/sub2', sub2],
  ['/two/other/sub2/unexistant', null],
  ['/foo', foo],
  ['/foo/1/2/3', f],
  ['/foo/1/2/3/unexistant', null],
  ['wrongy-path', null],
  ['1/2/3/4/5/6/7/8/9/10/11/12/13/14/crazy-depth', null],
  ['', null],
  [null, null],
  [undefined, null],
  [13141516, null],
  [{}, null],
  [function noop () {}, null]
]) {
  findTest(path, obj)
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
