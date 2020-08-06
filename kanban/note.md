# About three levels of function programming

- 有些人说他用到 function programming 只用到 algebraic datatype
  按照 computation and deduction
  - (1) algebraic datatype -- abstract syntax tree and evaluation
  - (2) dependent type -- judgment and inference rule -- evaluation in logic style
  - (3) Category theory -- relation between introduction rule and elimination rule -- inversion rule
  - 其中 (2) 是适合在已有的 dependent type 语言中做的，但是 (3) 不适合。
    不论如何我们都要用我们自己的语言来说实现 (2) 而不用已有的语言，
    这并不难，就像 LF 一样。

# About implicit arguments

- How should we use implicit arguments? (What should be `@given`?)
  - learn from List and Vec.
  - learn from scala2.

# About type subsumption

- https://homepage.cs.uiowa.edu/~jgmorrs/eecs662s19/notes/Notes-on-subsumption.html
- https://en.wikipedia.org/wiki/Subtyping#Subsumption

# About type directed partial evaluation

TODO

# ABC's function naming and inference rule

- Learn about ABC's function naming,
  see if the way we write inference rule
  will be much more natural in ABC.
  - https://homepages.cwi.nl/~steven/abc

- can we have a c style syntax + extendable keyword
  - to teach like scheme and lisp language family

# Arithmetic level and Church encoding

- arithmetic level

# Value, Neutral and Normal

- Can we transform the mutual recursive definition of
  Value Neutral Normal into single recursive definition of Value?
  - by the technique of "The seasoned schemer"?

- We can not, because Neutral is part of Value,
  and Neutral recur on Neutral.

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
