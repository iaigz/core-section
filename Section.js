const assert = require('assert')

const constructor = module.exports = function Section (params) {
  assert(this instanceof Section, 'use the new keyword')
  if (params === null) throw new TypeError('received null parameters')
  if (typeof params !== 'object') throw new TypeError('received non-object')
  if (!params) throw new TypeError('no parameters provided')

  // "slug" parameter is mandatory
  assert.strictEqual(typeof params.slug, 'string')
  assert(params.slug.length > 0, 'slug string must have length')

  params = {
    text: '',
    icon: null,
    parent: null,
    ...params
  }

  if (params.parent !== null) {
    assert(params.parent instanceof Section, 'parent must inherit Section')
  }

  Object.defineProperties(this, {
    slug: { value: params.slug, enumerable: true },
    text: { value: params.text || params.slug, enumerable: true },
    meta: { value: params.meta, enumerable: true },
    parent: { value: params.parent, enumerable: true },
    children: { value: [] }
  })

  const brothers = (this.parent === null) ? root : this.parent.children
  if (brothers.some(section => section.slug === params.slug)) {
    throw new ReferenceError(`parent has a child with slug=${this.slug}`)
  }
  brothers.push(this)

  Object.defineProperties(this, {
    id: { value: constructor.getId(this), enumerable: true },
    path: { value: constructor.getPath(this), enumerable: true }
  })

  if (typeof params.html === 'function') {
    this.html = params.html
  }

  return this
}

constructor.getId = function (instance) {
  return instance.parent === null
    ? `section-${instance.slug}`
    : `${instance.parent.id}-${instance.slug}`
}

constructor.getPath = function (instance) {
  return instance.parent === null
    ? `/${instance.slug}`
    : `${instance.parent.path}/${instance.slug}`
}

constructor.toString = function () {
  return `[#root ${constructor.name}]`
}

const root = []
constructor.tree = function () {
  return root
}

constructor.find = function (path) {
  if (typeof path !== 'string') return null
  const cumbs = path.substring(1).split('/')
  let index = root
  let tmp = null
  while (cumbs.length) {
    const slug = cumbs.shift()
    tmp = index.filter(section => section.slug === slug)[0]
    if (!tmp) return null
    index = tmp.children
  }
  return tmp
}

const prototype = constructor.prototype = {}

prototype.constructor = constructor

prototype.toString = function () {
  return `[${this.constructor.name} ${this.path}]`
}

prototype.append = function (params) {
  return new constructor({
    ...params,
    parent: this
  })
}

prototype.tree = function () {
  return this.children
}

prototype.html = function (data) {
  return `<h1>${this.constructor.name} "${this.text}"</h1>`
}

prototype.ansi = function (data) {
  return `# ${this.constructor.name} "${this.text}"`
}

prototype.json = function (data = {}) {
  return JSON.stringify({
    id: this.id,
    path: this.path,
    text: this.text,
    icon: this.icon,
    data: data,
    html: this.html(data),
    ansi: this.ansi(data)
  })
}

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */
