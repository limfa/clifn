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

function getArguments (fnString) {
  let fnS
  if (/^function\W/.test(fnString)) {
    const fr = /^function(?:\s+\w+)?\s*/
    fnS = fnString.replace(fr, '')
  }else {
    if (/^\(/.test(fnString)) {
      fnS = fnString
    }else {
      fnS = fnString.replace(/^\w+/, `($&)`)
    }
  }
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
    }else if ((char in stackMap) &&
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
  return fnS.slice(0, endI + 1)
}

const babel = require('babel-core')
const generator = require('babel-generator').default

function parser (fn) {
  if (typeof fn !== 'function') throw new Error(`param 'fn' error: not a function`)
  let fnString = getArguments(fn.toString())
  fnString += '=>{}'
  const { ast } = babel.transform(fnString, {
    code: false,
    comments: false,
    babelrc: false,
    highlightCode: false
  })
  function doParams (params) {
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
  return generator(ast).code.slice(1, -8)
}

module.exports = parser
