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

# lang3

> module system

- [lang3] `cli/commands/run.ts` optionally take `project.json` config file

> repl

- [lang3] `cli/commands/repl.ts` -- by `Project.piece_by_piece`
- [lang3] `lang3 repl` alias to `lang3`
- [lang3] `./dev` test `lang3 repl`

> project insight

- [lang3] [maybe] good view of `Project` on frontend (project insights)

# langx

> wissen

- learn from "Computation and Deduction" and Logic framework
  - Run datatype definition as logic programs.
  - 为古典逻辑设计形式语言。

- Note that, a prolog-like DSL for bidirectional type checking, would be wrong.
  because the aim of split one judgment `:` to two judgments `=>` and `<=`,
  is to avoid searching, and making the group of inference rules deterministic.

# cicada

> 有完整的例子来表明语言的设计有效。
> - 简单易读，可用作形式化数学结构的伪代码。

- [formalization] [EWD1240a] A little bit of lattice theory
  - To test our system.
  - This paper is about the relation between PartialOrder and Lattice.
  - Learn from the story line for teaching.
- [formalization] Algebraic structures -- https://en.wikipedia.org/wiki/Algebraic_structure
- [formalization] Lattice theory
- [formalization] Closure system -- for FCA
- [formalization] Topology theory
- [formalization] Category theory
- [formalization] Group theory
- [formalization] Category of Groups
- [formalization] Number theroy -- https://en.wikipedia.org/wiki/Number_theory
