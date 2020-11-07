# partech

> **Be the most easy to use parsing tool for programming language prototyping.**

> module system
> - Should we really do this?

- [partech] handle `$imports` in `Mod.from_present`
  - always import name for simplicity
  - use `{ ... }` for mimic `@import` syntax
- [partech] `Stmt` -- to build module
- [partech] built-in `zero_or_more` and `one_or_more` and `optional`
- [partech] `Top`
- [partech] `Top.from_present`

> partech-mode

- [partech] [emacs] learn modern emacs

> CLI

> intersection grammar

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
