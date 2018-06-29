const assert = require('assert')
const parser = require('../parser')

test('arrowsfunction1',()=>{
    const fn = ()=>{}
    const res = parser(fn)
    expect(res).toBe('')
})
test('arrowsfunction2',()=>{
    const fn =   (a,b)=>true
    const res = parser(fn)
    expect(res).toBe('a, b')
})
test('arrowsfunction3',()=>{
    const fn = (a,b)=>{ 
        return true 
    }
    const res = parser(fn)
    expect(res).toBe('a, b')
})
test('arrowsfunction4',()=>{
    const fn = (a='(',b='){',c="}{")=>{ return true }
    const res = parser(fn)
    expect(res).toBe(`a, b, c`)
})
test('arrowsfunction5',()=>{
    const fn = ({a,b="c"}={},[{d:D},e],...f) =>  { return {} }
    const res = parser(fn)
    expect(res).toBe('{ a, b }, [{ d: D }, e], ...f')
})

test('arrowsfunction6',()=>{
    const fn =  ({a,b="c"}={},[{d="\""},e],...f)   =>{ return {} }
    const res = parser(fn)
    expect(res).toBe('{ a, b }, [{ d }, e], ...f')
})

test('arrowsfunction7',()=>{
    const fn = ({a,b="c"}={},[{d="\""},e=`
            () '""  \` '  abc,
        `],...f)=>   { return {} }
    const res = parser(fn)
    expect(res).toBe(`{ a, b }, [{ d }, e], ...f`)
})

test('function1',()=>{
    const fn = function(){}
    const res = parser(fn)
    expect(res).toBe('')
})
test('function2',()=>{
    const fn = function  (a,b){ return true }
    const res = parser(fn)
    expect(res).toBe('a, b')
})
test('function3',()=>{
    const fn = function a_(a,b){ 
        return true 
    }
    const res = parser(fn)
    expect(res).toBe('a, b')
})
test('function4',()=>{
    const fn = function a_(a='(',b='){',c="}{"){ return true }
    const res = parser(fn)
    expect(res).toBe(`a, b, c`)
})
test('function5',()=>{
    const fn = function a_ ({a,b="c"}={},[{d:D},e],...f)   { return {} }
    const res = parser(fn)
    expect(res).toBe('{ a, b }, [{ d: D }, e], ...f')
})

test('function6',()=>{
    const fn = function a_ ({a,b="c"}={},[{d="\""},e],...f)   { return {} }
    const res = parser(fn)
    expect(res).toBe('{ a, b }, [{ d }, e], ...f')
})

test('function7',()=>{
    const fn = function a_ ({a,b="c"}={},[{d="\""},e=`
            () '""  \` '  abc,
        `],...f)   { return {} }
    const res = parser(fn)
    expect(res).toBe(`{ a, b }, [{ d }, e], ...f`)
})

test('complex', () => {
  const fn = ({ a, b = 'c' } = { z: { x: z } } , [{ b: B, d = '"', c: [z = 2], e: { f: F = { a: { b: 1 } } } }, e = ER] , [[[[[u]]]]] , ...f) => {
    return {}
  }
  const res = parser(fn)
  expect(res).toBe(`{ a, b }, [{ b: B, d, c: [z], e: { f: F } }, e], [[[[[u]]]]], ...f`)
})
