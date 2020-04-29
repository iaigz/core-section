const assert = require('assert')

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const Section = require('..')

//
// API example
//

const one = new Section({ slug: 'root-one' })
const two = new Section({ slug: 'root-two' })
const foo = new Section({ slug: 'root-foo' })

// append call returns a new "child" Section
one.append({ slug: 'one' })
// So chaining append calls adds sublevels
one.append({ slug: 'two' })
  .append({ slug: 'three' })
  .append({ slug: 'four' })

// this should add 3 sections to section "foo"
foo.append({ slug: 'foo-bar' })
foo.append({ slug: 'foo-baz' })
foo.append({ slug: 'foo-fak' })

//
// Test function
//
function treeTest (description, object, expect) {
  console.log(`DESC object as ${description}`)
  try {
    assert.strictEqual(typeof object.tree, 'function', 'no #tree function')
    console.log('PASS object has #tree() function')
    const tree = object.tree()
    assert.strictEqual(Array.isArray(tree), true, '#tree() must return array')
    assert.strictEqual(tree.length, expect.length, 'unexpected length')
    console.log('PASS object.tree() returns array of length %s', expect.length)

    expect.forEach((value, i) => {
      assert.strictEqual(typeof value.id, 'string', 'missing expected id')
      assert.strictEqual(tree[i].id, value.id)
      console.log('PASS object tree element %s has id %s', i, value.id)
      assert.strictEqual(typeof value.path, 'string', 'missing expected path')
      assert.strictEqual(tree[i].path, value.path)
      console.log('PASS object tree element %s has path %s', i, value.path)
    })
  } catch (err) {
    console.log('FAIL %s.tree() output seems wrong', object)
    console.error('object:', object)
    console.error('tree():', object.tree())
    console.error('expect:', expect)
    throw err
  }
  console.log('PASS %s\'s #tree() output seems ok', description)
}

//
// Tests
//

treeTest('Section builder', Section, [
  { id: 'section-root-one', path: '/root-one' },
  { id: 'section-root-two', path: '/root-two' },
  { id: 'section-root-foo', path: '/root-foo' }
])

treeTest('/root-one section instance', one, [
  { id: 'section-root-one-one', path: '/root-one/one' },
  { id: 'section-root-one-two', path: '/root-one/two' }
])
treeTest('/root-one/one section instance', one.tree()[0], [
  // this should be empty, as has no childs
])
treeTest('/root-one/two section instance', one.tree()[1], [
  { id: 'section-root-one-two-three', path: '/root-one/two/three' }
])
const three = one.tree()[1].tree()[0]
treeTest('/root-one/two/three section instance', three, [
  { id: 'section-root-one-two-three-four', path: '/root-one/two/three/four' }
])
treeTest('/root-one/two/three/four section instance', three.tree()[0], [
  // this should be empty, as has no childs
])

treeTest('/root-two section instance', two, [
  // this should be empty, as has no childs
])

treeTest('/root-foo section instance', foo, [
  { id: 'section-root-foo-foo-bar', path: '/root-foo/foo-bar' },
  { id: 'section-root-foo-foo-baz', path: '/root-foo/foo-baz' },
  { id: 'section-root-foo-foo-fak', path: '/root-foo/foo-fak' }
])
// /root-foo childs should be empty (no descendants)
treeTest('/root-foo first child', foo.tree()[0], [])
treeTest('/root-foo second child', foo.tree()[1], [])
treeTest('/root-foo third child', foo.tree()[2], [])

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
