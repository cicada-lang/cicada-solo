# lang3 -- 重新实现 cicada-structural-typing

> 由于，重新理解了 Value Neutral Normal 的结构，
> 并且简化了语言的功能，因此有很大机会重新做出一个成功的实现。

- 尝试实现 `@judgment` 中的 `@where` 语法关键词。
- 尝试使用 js 的 record (object) 与 Array 语法（包括 pattern matching）。

# TLT

> 强化对类型系统的理解与实现技术，
> 为 cicada-structural-typing 做准备。

- [lang1] `Exp.suite` should be checked instead of infered.
- [lang1] add syntax for `Exp.let` -- along with `Exp.suite`.

- [lang2] `Exp.suite` should be checked instead of infered.
- [lang2] add syntax for `Exp.let` -- along with `Exp.suite`.

- [lang1] [draft] exp-check
- [lang1] [draft] exp-evaluate
- [lang1] [draft] check

- [lang2] [draft] exp-check
- [lang2] [draft] exp-evaluate
- [lang2] [draft] check -- for car and cdr

- [lang2] [draft] implement `Pair` and `Arrow`

- [lang2] implement `Pair` and `Arrow` directly

- [lang3] [draft] check and infer

- [TLT] 2. Doin' What Comes Naturally
- [TLT] 3. Eliminate All Natural Numbers!
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

# partech -- parsing techniques

> Be the most easy to use parsing tool for programming language prototyping.

- handle `$import` in `Mod.build`
  - built-in `zero_or_more` and `one_or_more` and `optional`
  - always import name for simplicity

- intersection grammar

# parc

- parc -- to implement `pt/exp/exp-parse`
- like handle written parser
- [test] try examples in peg paper in parser generator
- [test] x in x test
  - S <- "x" S "x" | "x"

# re-design the syntax

- always use `@` keywords.

- two part of a code block.
  ``` cicada
  @affirm f : A
  @define f = a
  ```

# lang0 -- church-encoding

- church-boolean.cic
- church-numeral-predicates.cle
- church-pair.cic
- 直接用 Church numeral 来实现 Nat，而不用 ADT。
  其语义是迭代函数，也许有有趣的应用
  多了一个关于迭代函数的 API。

# lang1 -- Play with systemt

# lang2 -- 将 NbE 教程中的 tartlet 升级为 pie

- implement List for lang2.
- implement Vector for lang2.

- 如何对某一个类型以及相关的 Exp 作出充分的测试？

- test Equal of lang2.
- test Pi of lang2.
- test Absurd of lang2.

- use native `number` as `Nat`.


# langx -- lang1 + algebraic data type

# langx -- wissen

- learn from "Computation and Deduction" and Logic framework
  - Run datatype definition as logic programs.
  - 为古典逻辑设计形式语言。

- Note that, a prolog-like DSL for bidirectional type checking, would be wrong.
  because the aim of split one judgment `:` to two judgments `=>` and `<=`,
  is to avoid searching, and making the group of inference rules deterministic.

# langx -- lang2 + inductive data type

- 归纳类型（Inductive type）的推演规则。
  - Only one abstraction away.

# cicada -- fulfilling type

- 需求：
  - 有清晰的推演规则（Inference rules），要能向众人把语言的类型系统的设计讲清楚。
  - 有完整的例子来表明语言的设计有效，即使没有语言实现，也可用作形式化数学结构的伪代码。
- 填充类型（Fulfilling type）的推演规则。
- 我们需要 develop 这个关键词，来在证明时，把更多的信息包含在语境中。
  - 明确 develop 这个关键词的语义。
- [formalization] [EWD1240a] A little bit of lattice theory
  - 形式化这篇文章，以检验这样形式化是否真的好。
  - This paper is about the relation between PartialOrder and Lattice.
  - Learn from the story line.
- 形式化 Algebraic structures：https://en.wikipedia.org/wiki/Algebraic_structure
- 形式化 Lattice theory。
- 形式化 Closure system。-- 帮助学习 FCA。
- 形式化 Topology theory。
- 形式化 Category theory。
- 形式化 Group theory。
- 形式化 Category of Groups。
- 形式化 Number theroy：https://en.wikipedia.org/wiki/Number_theory
- 我们需要支持相互递归函数。
  - 可以通过使用副作用的 Env API 来实现。
  - 需要的时候可以 clone Env。
- 我们需要支持 Inductive type（为 Class 的语义）。
- 我们需要支持 Fulfilling type（为 Data 的语义）。
