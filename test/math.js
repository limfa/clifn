function Math (n) {
  return n
}

Math.add = (a, b) => a + b
Math.minus = (a, b) => a - b
Math.times = (a, b) => a * b
Math.div = (a, b) => a / b
Math.complex = function (a, b) { return this.div(this.times(this.minus(this.add(a, b), a), b), a) }

module.exports = Math
