# TLT

> 强化对类型系统的理解与实现技术。
> - 同时测试 lang2 与 lang3。

- [TLT] 4. Easy as Pie
- [TLT] 5. Lists, Lists, and More Lists
- [TLT] 6. Precisely How Many?
- [TLT] 7. It All Depends On the Motive
- [TLT] Recess: One Piece at a Time
- [TLT] 8. Pick a Number, Any Number
- [TLT] 9. Double Your Money, Get Twice as Much
- [TLT] 10. It Also Depends On the List
- [TLT] 11. All Lists Are Created Equal
- [TLT] 12. Even Numbers Can Be Odd
- [TLT] 13. Even Haf a Baker's Dozen
- [TLT] 14. There's Safety in Numbers
- [TLT] 15. Imagine That ...
- [TLT] 16. If It's All the Same to You
- [TLT] A. The Way Forward
- [TLT] B. Rules Are Made to Be Spoken

# lang4 -- jojo

> To study normal form and recursion.
> Can be used to play with "Diagonalization and Self-Reference"

- [lang4] be clear about the semantic of "Diagonalization and Self-Reference"
- [lang4] design a normalization algorithm
  - 也比可以用 NbE，也许比一般的 NbE 更复杂。

# lang3

> nested match.

- [lang3] be able to add type annotation to `Exp.fn`
  - we will be able to infer such `fn`
  - which might be needed by `@match`

- [lang3] there might be `@match`
  - which will be direct application of `Exp.case_fn`

> implict arguments.

- [lang3] maybe merge `env` `ctx` into `the`.

- [lang3] checking about `Pattern` in the `arg_t` and `ret_t` of `pi`
  - we also need to use unification here.
  - we will need a new ctx-like argument for equations -- `Equ`.

> Improve the readback of recursive expression.

- [lang3] We SHOULD NOT `shadow mod value` for non recursive `Den`

> 更完整的 dependent + structural type 语言。

- [lang3] `Value.subtype` -- structural cls
- [lang3] `Value.subtype` -- function type

> module system

- [lang3] use `Mod` to design module system

# partech

> Be the most easy to use parsing tool for programming language prototyping.

- [partech] use `Mod` to design module system

- handle `$import` in `Mod.build`
  - built-in `zero_or_more` and `one_or_more` and `optional`
  - always import name for simplicity

- intersection grammar

# parc

> 严格确保线性时间的 parser combinator。
> 对于 parser 而言，只有线性时间才是可以接受的复杂度。

- parc -- to implement `pt/exp/exp-parse`
- like handle written parser
- [test] try examples in peg paper in parser generator
- [test] x in x test
  - S <- "x" S "x" | "x"

# lang0 -- church-encoding

- church-boolean.cic
- church-numeral-predicates.cle
- church-pair.cic
- 直接用 Church numeral 来实现 Nat，而不用 ADT。
  其语义是迭代函数，也许有有趣的应用
  多了一个关于迭代函数的 API。

# lang1 -- Play with systemt

# lang1 -- 添加 algebraic data type

# lang2 -- 将 NbE 教程中的 tartlet 升级为 pie

- [lang2] be able to add type annotation to `Exp.fn`

- implement List for lang2.
- implement Vector for lang2.

- 如何对某一个类型以及相关的 Exp 作出充分的测试？

- test Equal of lang2.
- test Pi of lang2.
- test Absurd of lang2.

- use native `number` as `Nat`.

# lang2 -- 添加 inductive data type

- 归纳类型（Inductive type）的推演规则。
  - Only one abstraction away.

# langx -- wissen

- learn from "Computation and Deduction" and Logic framework
  - Run datatype definition as logic programs.
  - 为古典逻辑设计形式语言。

- Note that, a prolog-like DSL for bidirectional type checking, would be wrong.
  because the aim of split one judgment `:` to two judgments `=>` and `<=`,
  is to avoid searching, and making the group of inference rules deterministic.

# cicada

> 有完整的例子来表明语言的设计有效，即使没有语言实现，也可用作形式化数学结构的伪代码。

- [formalization] [EWD1240a] A little bit of lattice theory
  - 形式化这篇文章，以检验这样形式化是否真的好。
  - This paper is about the relation between PartialOrder and Lattice.
  - Learn from the story line for teaching.
- 形式化 Algebraic structures：https://en.wikipedia.org/wiki/Algebraic_structure
- 形式化 Lattice theory。
- 形式化 Closure system。-- 帮助学习 FCA。
- 形式化 Topology theory。
- 形式化 Category theory。
- 形式化 Group theory。
- 形式化 Category of Groups。
- 形式化 Number theroy：https://en.wikipedia.org/wiki/Number_theory
- 我们需要支持 Inductive type（为 Data 的语义）。
- 我们需要支持 Fulfilling type（为 Class 的语义）。
