# 带名类型（Nominal type）与结构类型（Structural type）。

- 与带名类型相对的是结构类型（Structural type），
  其中无法区分 Zero 与 Null 等类型。
- 我们需要带名类型来表达我们的意图（Intension）。
- 在带名类型中，物质（Object）与属性（Attribute）关系更明显。

# 我们可以同时实现带名类型与填充类型。

- 填充类型只用于 Class，保持基础数据类型简单。

# 用内置（built-in）的方式来实现基本等词（equality）。

- 也许需要内置如下函数：
  ``` scala
  @given(A: Type)
  transport(
    equation: Equal(x, y),
    motive(x: A): Type,
    base: motive(x),
  ): motive(y) = base
  ```
