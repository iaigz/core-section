const assert = require('assert')

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

let Section = null

try {
  Section = require('..')
  console.log('PASS module can be required without errors')
} catch (err) {
  console.error(err.stack)
  console.log('FAIL module should be able to be required without errors')
  process.exit(1)
}

try {
  assert.strictEqual(typeof Section.tree, 'function', '#tree must be function')
  const tree = Section.tree()
  assert.strictEqual(Array.isArray(tree), true, '#tree must return array')
} catch (err) {
  console.error(err.stack)
  console.error('Section:', Section)
  console.error('tree():', Section.tree())
  console.log('FAIL builder interface seems wrong')
  process.exit(1)
}
console.log('PASS builder interface (class methods) seems ok')

let section = null

try {
  section = new Section()
  throw new Error('fail')
} catch (err) {
  if (err.message === 'fail') {
    console.log('FAIL instances should not be able to be created without args')
    process.exit(1)
  }
  console.log('PASS instances are not able to be created without parameters')
}

// Values not accepted for instance creation
;[
  null,
  true,
  false,
  0,
  1,
  'string',
  {}, // empty object
  { slug: '' }, // empty slug
  { slug: null }, // null slug
  { slug: 'something', parent: 'invalid-type' } // non-section parent
].forEach(value => {
  try {
    section = new Section(value)
    throw new Error('should fail')
  } catch (err) {
    if (err.message === 'should fail') {
      console.log('FAIL instance should not be able to be created with', value)
      process.exit(1)
    }
    console.log('PASS instance creation throws with', value)
  }
})

;[
  {
    slug: 'something'
  },
  {
    slug: 'otherthing',
    text: 'Dumb Section'
  }
].forEach(value => {
  try {
    section = new Section(value)
    console.log('PASS instance can be created with %s', value)
  } catch (err) {
    console.error(err.stack)
    console.error('value:', value)
    console.log('FAIL instances should be able to be created with %s', value)
    process.exit(1)
  }
  if (section instanceof Section) {
    console.log('PASS inheritance chain seems ok for', value)
  } else {
    console.log('FAIL inheritance chain broken for', value)
    process.exit(1)
  }
  try {
    assert.strictEqual(section.parent, null, 'parent should be null')
    assert.strictEqual(typeof section.render, 'function', 'missing render()')
    assert.strictEqual(typeof section.append, 'function', 'missing append()')
  } catch (err) {
    console.error(err.stack)
    console.error('value:', value)
    console.log('FAIL Section interface is not meet for', value)
    process.exit(1)
  }
  console.log('PASS Section interface seems ok for', value)
})

// now that we have a Section with slug "something"...
try {
  /* eslint-disable no-new */
  new Section({ slug: 'something' })
  throw new Error('should fail')
} catch (err) {
  if (err.message === 'should fail') {
    console.log('FAIL two sections with same slug should throw')
    process.exit(1)
  }
  console.log('PASS creating a section with an existant slug throws error')
}

// given a section ancestor...
const ancestor = new Section({ slug: 'ancestor' })
// child may have the same slug as its parent
try {
  /* eslint-disable no-new */
  new Section({ slug: 'ancestor', parent: ancestor })
} catch (err) {
  console.log('FAIL an ancestor Section may have a child with same slug')
  throw err
}
console.log('PASS ancestor can have child with same slug as its parent')
// but only one child of same parent
try {
  /* eslint-disable no-new */
  new Section({ slug: 'ancestor', parent: ancestor })
  throw new Error('should fail')
} catch (err) {
  if (err.message === 'should fail') {
    console.log('FAIL two sections with same parent cant have same slug')
    process.exit(1)
  }
  console.log('PASS Section childs cannot repeat same slug')
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
