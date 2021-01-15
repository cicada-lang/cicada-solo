# main

> To improve the design of our type system framework,
> we need enough concrete example types.

- Changing lang1 to OOP will provide us more examples about readback

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

# lang0

> refactoring `Stmt`

- [lang0] `decls/define.ts` -- `Define` for `Stmt.def`
- [lang0] `decls/show.ts` -- `Show` for `Stmt.show`
- [lang0] `Decl` as intersection type

# lang1

> refactoring `Stmt`

- [lang1] `Let` <: `Exp`
- [lang1] `Let` syntax

- [lang1] no `Begin` use `Let` instead
  - `Exp` should not depend on `Stmt`

- [lang1] `Stmt.def` vs `Stmt.show`
- [lang1] `Stmt.def` -- `execute` vs `declare`

# lang2

> refactoring `Value`

> refactoring `Neutral`

> refactoring `Normal`

> refactoring `Stmt`

> naming convention

- [lang2] maybe we should change the naming convention to go without dot.

> 将 NbE 教程中的 tartlet 升级为 pie

- [lang2] `List`, `List.cons`, `List.null`, `List.rec`
- [lang2] `Vector`
- [lang2] be able to add type annotation to `Exp.fn`

> 充分测试

- 如何对某一个类型以及相关的 Exp 作出充分的测试？

- [lang2] test `Equal`
- [lang2] test `Pi`
- [lang2] test `Absurd`

> 优化

- use native `number` as `Nat`.

# lang3

> refactoring `Value`

- We need to do typed readback,
  take Pi for example, we can not only readback Fn,
  but also `NotYetValue` value that shall be Fn.
  - The same for Cls.
  - This is about eta-expansion,
    which make noraml forms more noraml.
    - can we make noraml forms even more noraml
      by using postfix notation?
  - How about CaseFn?
    where the target is the argument
    instead of the function.
  - Maybe we do not need to "dispatch over type in the readback",
    but we do need to handle eta-expansion before `NotYetValue` other cases.
  - Absurd is also a special case, which must goes before `NotYetValue`.
  - When the Pi is the type of datacons or typecons,
    it is again a special case.

- We do not understand union type well,
  it seems we need to handle it at so many places.
  - [bug] examples/lang3/out/datatype-vec.cic

- [lang3] `Readbackable` -- `FnValue` -- fn-value
- [lang3] `Readbackable` -- `CaseFnValue` -- case-fn-value
- [lang3] `Readbackable` -- `ObjValue` -- obj-value
- [lang3] no branches in `Readback.readback`
- [lang3] `readback_neutral` for `Neutral`
- [lang3] `readback_normal` for `Normal`
- [lang3] `Value` as intersection type instead of union type

> refactoring `Exp`

- [lang3] refactor `check_union_type` & `check_by_infer`

- [lang3] fix the type casting in `src/lang3/exps/typecons/typecons-inferable.ts`
- [lang3] fix the type casting in `src/lang3/exps/union/union.ts`
- [lang3] fix the problem that `Exp` is a dependency hub.

> namespace

- [lang3] check and report empty module
- [lang3] build up parent module when mount a `@module` -- for using first-level module
- [lang3] be able to use every first-level module without `@import`
- [lang3] be able to readback `Value.mod` -- to first-level module
- [lang3] be able to `@import` specific `Den`
- [lang3] `Mod.Den.namespace` -- transparent -- can use bandings in current module
- [lang3] syntax for `Mod.Den.namespace` -- `@namespace`
- [lang3] `Mod.Den.typecons` -- with its `namespace`
- [lang3] syntax for defining bindings in `Mod.Den.typecons`

> syntax

- [lang3] fix syntax about auto currying -- `f(x, y)` as sugar of `f(x)(y)`

> nested match

- [lang3] more simple rule about pattern variable

- [lang3] be able to add type annotation to `Exp.fn`
  - we will be able to infer such `fn`
  - which might be needed by `@match`

- [lang3] there might be `@match`
  - which will be direct application of `Exp.case_fn`

> improve the readback of recursive expression

- [lang3] We SHOULD NOT `mute_recursive_exp_in_mod` for non recursive `Den`

> structural subtyping

- [lang3] `Value.subtype` -- structural cls
- [lang3] `Value.subtype` -- function type

> domain-driven design

- in terms of domain-driven design, what is the core domain of cicada language? set theory?

> lang3 as cicada

- maybe lang3 can not be cicada,
  because we can not do object-oriented design in lang3.

  - maybe we do not need object-oriented design,
    because we can use explicit function table passing style.

  - maybe we can use object-oriented design
    by record type and higher order functions.

# lang4

> OOP

- [lang4] primitive functions
- [lang4] `@class`
- [lang4] `@list [...]`

> maybe

- [lang4] explicit control
- [lang4] improve `Value.equal`

> questions

- lambda calculus has a equational theory,
  what is the equational the for jojo?
  - maybe we should not use
    the classic semantic framework of lambda calculus
    to understand the semantic of jojo

- what is dependent type in jojo?
  - note that, we do not need to infer function type.

- why simple type + type as value is not useful?
  - maybe it is still useful, just no dependent type at run time.

# lang5

> untyped jojo calculus
> - no normalization, but has directly implemented
>   equivalence by execution.

- [lang5] `AssertEqual` & `AssertNotEqual`
- [lang5] implement `value_equal` by execution
- [lang5] `value_equal` handle `!` -- by `execution_trace` in `ValueStack`
- [lang5] test equivalence of high order jojo

> the difference between lambda calculus and jojo must be understand by topology.

- 也许 lambda calculus 是 topology 而 jojo 是代数？

- 只有暂时不考虑 subst 机制，我们才能将拓扑性质从 jojo 中分离出来。
  因此我们先实现 `! [] 列表置换` 这三个 jo 之间的等式理论。
  - 判断等价的时候，可以通过实际作用于列表，然后看结果，来完成。
  - 因为只有 `! [] 列表置换` 所以除了某些 ! 都可以作用。
  - 对于不能作用的 `!` 可以记录下 `!` 的操作，然后比较结果的时候，也比较记录。
  - 对于这个等式理论，我们需要证明和 lambda calculus 类似的属性。
