# main

> 理解关于递归的理论，因为 readback 的难点就是递归。
> 我目前唯一知道的实现递归的方式就是用 mod，但是这给 readback 带来了困难。
> - 递归函数是否可以有效地被化归到一般递归组合子，比如 fix 与 Y？
> - 递归函数之间的等价问题是否可以被化归到 Graph isomorphism problem？
> - 同时理解 jojo 与 lambda calculus 中的递归现象。
> - cell complex 是否可以被划归到 Graph theory 或者 hypergraph theory？

- raymond-smullyan
  - to understand diagonalization is to understand recursion without name
  - to understand diagonalization and recursion is to understand graph
  - graph seems is more complicated than tree,
    just like tree seems is more complicated than number
  - in lambda calculus, two graph can be applied or composed to form new graph,
    just like in higher order algebra, two cell-complex can be can be composed to form new cell-complex

- stephen-wolfram/a-new-kind-of-science

> To improve the design of our type system framework,
> we need enough concrete example types.

- Changing lang2 to support pie will provide us more examples.
  - Before supporting pie, we change the design of lang2 from procedural to OOP.
  - Changing lang2 to OOP will provide us more examples about readback

- TLT will provide us a suite of tests, and a philosophy of testing.

# partech

> prepare moving partech out to its own repo.

- [partech] learn more about framework design
- [partech] change style from procedural to OOP.

# TLT

> 强化对类型系统的理解与实现技术。
> - 同时测试 lang2 与 lang3。

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

# cicada

> syntax

- `Let` <: `Exp`
- `Let` syntax

- no `Begin` use `Let` instead
  - `Exp` should not depend on `Stmt`

- simplify the interface `Stmt`

- add `@check` syntax for testing

- to use `@claim` and `@define`

> refactoring `Value`

> refactoring `Neutral`

> refactoring `Normal`

> refactoring `Stmt`

> naming convention

- maybe we should change the naming convention to be without dot.

> 将 NbE 教程中的 tartlet 升级为 pie

- `List`, `List.cons`, `List.null`, `List.rec`
- `Vector`
- be able to add type annotation to `Exp.fn`

> 充分测试

- 如何对某一个类型以及相关的 Exp 作出充分的测试？

- test `Equal`
- test `Pi`
- test `Absurd`

> 优化

- use native `number` as `Nat`.
