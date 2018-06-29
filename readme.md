## intro

node无侵入命令行工具

只支持模块为函数


## todo

不支持

* 因为是将变量列出来（空为undefined），再组成参数出入函数，所以类似这种2从默认值不能支持后者
  ({a:1, b:2} = {a:2}) => {}

* 函数上模块注释不支持显示

* 上 npm 
* 做成全局命令

## usage

```bash
node cmd test/add3 -a=1 -b=3 -c=5
```

```
node cmd --help
```

```
node cmd --version
```

```
node cmd test/add3 --help
```
