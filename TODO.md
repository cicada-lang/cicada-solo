- import cores with `Cores` prefix -- in `exps/`
- import cores with `Cores` prefix -- in `cores/`
- import exps with `Exps` prefix

- `evaluate` should not take `ctx` as argument.

  - After split the `Exp` into `Exp` and `Core`,
    it is clear that `evaluate` is method of of `Core`,
    `infer` and `check` are methods of `Exp` (which can take `ctx`),
    thus it is useless to pass `ctx` into `evaluate`.


- split the responsibilities of `Exp` to `Exp` and `Core`

  > If we can achieve this, we will be better at
  >   understanding type system than most of the others.

  > We need to do this little by little.

  - [x] `core` -- only `evaluate` `repr` `alpha_repr`
  - [x] `readback` return `Core`
  - [] `check` return `Core`
  - [] `infer` return `{ t: Value, exp: Core }`
  - [] `exp` -- only `check` `infer` `repr`


> With elaboration,
>   we can elaborate `Exps.ListRec` into `Cores.ListInd` (which need `readback`),
>   or into `Cores.ListRec` (which does not need `readback`).

- `ListRec.apply`

- [tlt] 5. Lists, Lists, and More Lists

# pie

- [elaboration] implement `nat_rec` directly -- by elaboration

- [pie] `Vector` --  `Vector` `vec()` `vecnil`

# questions?

- what is the duality between introduction rule and elimination rule?
  (how to use introduction rule to generate elimination rule and all other rules?)
  - adjoint functors -- category theory

- how to explain the formation rule, introduction rule and elimination rule as little style laws?
- how to explain the computation rule, eta rule and sameness rules as little book style commandments?

- what is elaboration?
- about implementing dependent type system (without recursion),
  are there any point I am still missing?

# cicada

- [class] -- handle `this`
  - since we do not have recursion, `this` will be `so far`

- [optimization] use native `number` as `Nat`

- [pattern matching] algebric datatype -- `@datatype`
  - generate `ind`

# the little typer

- [tlt] 6. Precisely How Many?
- [tlt] 7. It All Depends On the Motive
- [tlt] Recess: One Piece at a Time
- [tlt] 8. Pick a Number, Any Number
- [tlt] 9. Double Your Money, Get Twice as Much
- [tlt] 10. It Also Depends On the List
- [tlt] 11. All Lists Are Created Equal
- [tlt] 12. Even Numbers Can Be Odd
- [tlt] 13. Even Haf a Baker's Dozen
- [tlt] 14. There's Safety in Numbers
- [tlt] 15. Imagine That ...
- [tlt] 16. If It's All the Same to You
- [tlt] A. The Way Forward
- [tlt] B. Rules Are Made to Be Spoken

# library management

- [library] can be used as a module

# formalization

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
- [formalization] Category of Groups
- [formalization] Number theroy -- https://en.wikipedia.org/wiki/Number_theory
