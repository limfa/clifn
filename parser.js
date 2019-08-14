const babel = require('babel-core')
const generator = require('babel-generator').default

const stackMap = {
  '(': {
    match: ')',
    exclude: []
  },
  '"': {
    match: '"',
    accpet: []
  },
  "'": {
    match: "'",
    accpet: []
  },
  '`': {
    match: '`',
    accpet: []
  }
}

function getArguments(fnString) {
  // console.log(fnString)
  fnString = fnString.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '')
  let fnS = fnString.replace(
    /^\s*(static\s+)?(async\s+)?(function\s*)?(\*\s*)?\s*/,
    ''
  )
  if (/^\w+\s*=>/.test(fnS)) {
    fnS = fnS.replace(/^\w+/, `($&)`)
  } else if (!/^\(/.test(fnS)) {
    fnS = fnS.replace(/^\w+\s*/, ``)
  }
  // console.log(fnS)
  let sl = fnS.length
  // if(fnS[0]!=='(') throw new Error('impossibility')
  const stack = []
  let curM = '('
  let endI
  for (let i = 1; i < sl; ++i) {
    let char = fnS[i]
    let sm = stackMap[curM]
    if (sm.match === char) {
      if (stack.length === 0) {
        endI = i
        break
      }
      curM = stack.pop()
    } else if (
      char in stackMap &&
      (sm.accpet ? sm.accpet.indexOf(char) !== -1 : true) &&
      (sm.exclude ? sm.exclude.indexOf(char) === -1 : true)
    ) {
      stack.push(curM)
      curM = char
    }
    // 去掉反义
    if (char === '\\') ++i
  }
  // if(!endI) throw new Error('impossibility')
  const str = fnS.slice(0, endI + 1)
  // console.log(str)
  return str
}

function parser(fn) {
  if (typeof fn !== 'function')
    throw new Error(`param 'fn' error: not a function`)
  let fnString = getArguments(fn.toString())
  fnString += '=>{}'
  const { ast } = babel.transform(fnString, {
    code: false,
    comments: false,
    babelrc: false,
    highlightCode: false
  })
  function doParams(params) {
    params.forEach(v => {
      if (v.type === 'AssignmentPattern') {
        Object.assign(v, v.left)
      }
      if (v.type === 'ObjectPattern') {
        doParams(v.properties)
      } else if (v.type === 'ArrayPattern') {
        doParams(v.elements)
      } else if (v.type === 'ObjectProperty') {
        doParams([v.value])
      }
    })
  }
  // console.log(JSON.stringify(ast.program.body[0].expression.params))
  doParams(ast.program.body[0].expression.params)
  let { code } = generator(ast)
  return /^\(/.test(code) ? code.slice(1, -8) : code.slice(0, -7)
}

module.exports = parser
