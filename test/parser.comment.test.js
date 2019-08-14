const assert = require('assert')
const parser = require('../parser')

assert.strictEqual(
  parser(function /* => */ fn(
    /* {xx}
     */ a,
    b
  ) {}),
  'a, b'
)
assert.strictEqual(parser(function /* => */ fn /* {xx} *\/ */(a, b) {}), 'a, b')
assert.strictEqual(
  parser(function // xxx
  fn /* {xx} *\/ 
  // *
  */(a, b) {}),
  'a, b'
)
