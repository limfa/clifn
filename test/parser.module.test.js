const assert = require('assert')
const parser = require('../parser')

// test('module test', () => {
const m1 = {
  a0(a) {},
  a1: a => {},
  a2: (a, aa) => {},
  a3: function(a, aa) {},
  a31: function f(a, aa) {},
  a4: function*(a, aa) {},
  a41: function* f(a, aa) {},

  async a5(a) {},
  a6: async a => {},
  a7: async (a, aa) => {},
  a8: async function(a, aa) {},
  a81: async function f(a, aa) {},
  a9: async function*(a, aa) {},
  a91: async function* f(a, aa) {}
}

assert.strictEqual(parser(m1.a0), 'a')
assert.strictEqual(parser(m1.a1), 'a')
assert.strictEqual(parser(m1.a2), 'a, aa')
assert.strictEqual(parser(m1.a3), 'a, aa')
assert.strictEqual(parser(m1.a4), 'a, aa')
assert.strictEqual(parser(m1.a5), 'a')
assert.strictEqual(parser(m1.a6), 'a')
assert.strictEqual(parser(m1.a7), 'a, aa')
assert.strictEqual(parser(m1.a8), 'a, aa')
assert.strictEqual(parser(m1.a9), 'a, aa')
assert.strictEqual(parser(m1.a31), 'a, aa')
assert.strictEqual(parser(m1.a41), 'a, aa')
assert.strictEqual(parser(m1.a81), 'a, aa')
assert.strictEqual(parser(m1.a91), 'a, aa')

class m2 {
  static a0(a) {}
  static async a1(b) {}
  static *a2(c) {}
  static async *a3(d) {}
}

assert.strictEqual(parser(m2.a0), 'a')
assert.strictEqual(parser(m2.a1), 'b')
assert.strictEqual(parser(m2.a2), 'c')
assert.strictEqual(parser(m2.a3), 'd')

const m3 = {}
m3.a0 = a => 1
m3.a1 = (a, b) => 1
m3.a2 = async a => 1
m3.a3 = async (a, b) => 1
m3.a4 = function(a) {}
m3.a5 = async function(a) {}
m3.a6 = function*(a) {}
m3.a7 = async function*(a) {}
m3.a8 = function f(a) {}
m3.a9 = async function f(a) {}
m3.a10 = function* f(a) {}
m3.a11 = async function* f(a) {}

assert.strictEqual(parser(m3.a0), 'a')
assert.strictEqual(parser(m3.a1), 'a, b')
assert.strictEqual(parser(m3.a2), 'a')
assert.strictEqual(parser(m3.a3), 'a, b')
assert.strictEqual(parser(m3.a4), 'a')
assert.strictEqual(parser(m3.a5), 'a')
assert.strictEqual(parser(m3.a6), 'a')
assert.strictEqual(parser(m3.a7), 'a')
assert.strictEqual(parser(m3.a8), 'a')
assert.strictEqual(parser(m3.a9), 'a')
assert.strictEqual(parser(m3.a10), 'a')
assert.strictEqual(parser(m3.a11), 'a')
// })
