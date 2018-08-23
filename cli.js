const parser = require('./parser')
const path = require('path')
const vm = require('vm')
let yargs = require('yargs')

function main (file, method = null) {
  yargs.version(false)
  yargs.help(false)
  let { argv } = yargs

  if (!file) file = argv._[0]
  if (!method) method = argv._[1]

  if (argv.version && !file) {
    yargs.version(true)
    let version = '0.0.0'
    try {
      version = require('./package.json').version
    } catch (ex) { }
    console.log(version)
    return
  }

  if (argv.help || !file) {
    yargs.version(!file)
    yargs.help(true)
    if (!file) {
      yargs.command('<file> [<method>]', 'execute file in command line', yargs => {
        yargs.positional('file', {
          describe: 'a nodejs file name relative cwd',
          type: 'string'
        })
        yargs.positional('method', {
          describe: 'a method function of <file>',
          type: 'string'
        })
      })
    } else {
      let context = vm.createContext({})
      const {fn} = getModule(file, method)
      let args = parser(fn)
      let code = `
      const result = {}
      with(new Proxy(this, {
        has:(t, key)=>{
          result[key] = {}
          return true
        },
        get:()=>[],
      })){[${args}] }
      result`
      let options = vm.runInContext(code, context)
      yargs.options(options)
      const usage = fn.toString().split('\n', 4).map((v, i) => {
        if (i === 3) {
          return '...'
        }
        if (v.length > 60) return v.slice(0, 60) + ' ...'
        return v
      }).join('\n')
      yargs.usage(usage)
    }
    return yargs.showHelp('log')
  }

  if (file) {
    let {fn, ctx} = getModule(file, method)
    let args = parser(fn)
    delete argv.$0
    delete argv._
    let context = vm.createContext(argv)
    args = vm.runInContext(`with(new Proxy(this, { has:()=>true })){[${args}] }`, context)
    let res = fn.apply(ctx, args)
    Promise.resolve(res).then(res => console.log(JSON.stringify(res, null, 2)))
  }

  function getModule (file, method = null) {
    let filePath = path.join(process.cwd(), file)
    let fn = require(filePath)
    let ctx = null
    if (method) {
      ctx = fn
      fn = fn[method]
    }
    if (typeof fn !== 'function') throw new Error(`<file>[<method>] must be function`)

    return {ctx, fn}
  }
}

module.exports = main

if (require.main === module) {
  main()
}
