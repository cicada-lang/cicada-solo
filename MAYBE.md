# pac

> 严格确保线性时间的 parser combinator。
> 对于 parser 而言，只有线性时间才是可以接受的复杂度。
> - Be able to use pac like handle written parser

- [pac] to implement `partech/exp/exp-parse`
- [pac] [test] try examples in peg paper in parser generator
- [pac] [test] x in x test
  - S <- "x" S "x" | "x"

# lang0

> church encoding

- church-boolean.cic
- church-numeral-predicates.cle
- church-pair.cic
- 直接用 Church numeral 来实现 Nat，而不用 ADT。
  其语义是迭代函数，也许有有趣的应用
  多了一个关于迭代函数的 API。

# lang1

- [lang1] try to generate checker from type

> Play with systemt

> 添加 algebraic data type
