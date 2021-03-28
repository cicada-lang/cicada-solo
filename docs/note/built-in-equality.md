# 用内置（built-in）的方式来实现基本等词（equality）。

也许需要内置如下函数：

``` cicada
@given(A: Type)
transport(
  equation: Equal(x, y),
  motive(x: A): Type,
  base: motive(x),
): motive(y) = base
```
