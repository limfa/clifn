## intro

nonintrusive command line tool for node

支持模块为函数或对象都支持


## todo

不支持

* 因为是将变量列出来（空为undefined），再组成参数出入函数，所以类似这种2从默认值不能支持后者
  ({a:1, b:2} = {a:2}) => {}

* (a, b, ...args)  args为undefined没法为空数组

* 函数上模块注释不支持显示

* help 对象方法列出


## usage

```bash
node cli test/add3 -a=1 -b=3 -c=5
clifn test/add3 -a=1 -b=3 -c=5
```

```
node cli --help
clifn --help
```

```
node cli --version
clifn --version
```

```
node cli test/add3 --help
clifn test/add3 --help
```

```
clifn test/math add -a 1 -b 2
```
