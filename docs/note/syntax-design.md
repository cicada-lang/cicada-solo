# Syntax Design

## 用 `>>>` 做反向的 `=`

2020-10-03

在一般的从右向左的赋值语法（`=`）之外，
提供一个从左向右的赋值语法（`>>>`）对于排版来说是有益的。

比如：

``` cicada
Exp.infer(ctx, Exp.ap(target, arg)) = ret_t @where {
  Ty.arrow(arg_t, ret_t) = Exp.infer(ctx, target)
  Exp.check(ctx, arg, arg_t)
}
```

写成下面这样，更有利于把函数当作
Bidirectional type checking 中的规则来理解：

``` cicada
Exp.infer(ctx, Exp.ap(target, arg)) = ret_t @where {
  Exp.infer(ctx, target) >>> Ty.arrow(arg_t, ret_t)
  Exp.check(ctx, arg, arg_t)
}
```

我选取 `>>>` 是因为它的像形意义明显，并且类似 python 的 prompt。

## 可规模化的「语法关键词」机制

- 用 `@` 来做语法关键词的前缀，使得语法关键词 scalable。

- `@datatype` 与 `@judgment` 同义。

- 定义 函数 与 类型 的时候也加上 module 前缀。
  - 这样可以做到，怎么定义就怎么用。
  - 定义 `@datatype` 与 `@judgment` 时，不用在其内部给构造子加 module 前缀。
