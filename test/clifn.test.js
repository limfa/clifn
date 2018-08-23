const path = require('path')
const {exec} = require('child_process')
const pkg = require('../package.json')

const cwd = path.join(__dirname, '..')

test('help', () => {
  exec('node bin/clifn --help', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(`clifn [command]

Commands:
  clifn <file> [<method>]  execute file in command line

Options:
  --version  Show version number                                       [boolean]
  --help     Show help                                                 [boolean]

`)
  })
})

test('version', () => {
  exec('node bin/clifn --version', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(pkg.version + '\n')
  })
})

test('add3 help', () => {
  exec('node bin/clifn test/add3 --help', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(`function add3(a, b, c) { // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ...
  //
  return a + b + c
...

Options:
  --help  Show help                                                    [boolean]
  -a
  -b
  -c

`)
  })
})

test('add3', () => {
  exec('node bin/clifn test/add3 -a1 -b=2 -c 3', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(`6
`)
  })
})

test('add3Async', () => {
  exec('node bin/clifn test/add3Async -a1 -b=2 -c 3', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(`6
`)
  })
})

test('module.method', () => {
  exec('node bin/clifn test/math complex -a1 -b=2', {cwd}, (err, stdout, stderr) => {
    expect(err).toBe(null)
    expect(stderr).toBe('')
    expect(stdout).toBe(`4
`)
  })
})
