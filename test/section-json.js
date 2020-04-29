const assert = require('assert')

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const Section = require('..')

//
// Test function
//
function jsonTest (object, expect) {
  console.log('DESC object as %s', object)
  let actual = null
  try {
    actual = object.json()
  } catch (err) {
    console.log('FAIL object.json should never throw')
    throw err
  }
  try {
    actual = JSON.parse(actual)
  } catch (err) {
    console.log('FAIL object.json should return valid JSON data')
    throw err
  }
  try {
    assert.deepStrictEqual(actual, expect)
  } catch (err) {
    console.error('object:', object)
    console.error('actual:', actual)
    console.error('expect:', expect)
    console.log('FAIL object.json() expected return mismatch')
    throw err
  }
  console.log('PASS object.json() returns expected value')
}

//
// sections
//

const one = new Section({ slug: 'one' })
const two = new Section({
  slug: 'two',
  html: data => `section two html string`
})

//
// Tests
//
for (const [object, expect] of [
  [one, {
    id: 'section-one',
    text: 'one',
    path: '/one',
    ansi: '# Section "one"',
    html: '<h1>Section "one"</h1>',
    data: {}
  }],
  [two, {
    id: 'section-two',
    text: 'two',
    path: '/two',
    ansi: '# Section "two"',
    html: 'section two html string',
    data: {}
  }],
]) {
  jsonTest(object, expect)
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
