- [refactoring] `Telescope` extract the use of `check_conversion`

- [refactoring] `ClsValue` extract `Fulfilled` class

- elab `super` in `Exps.Ext` to object with parent fields
  - use the context instead expression substitution
    - this does not work, because when evaluate `Cores.Cls`,
      we can not put `super` in to the `env` of `Telescope` properly

- use `subtype` instead of `conversion`

- when we do a typed binding, we need to be able to refine the declared type
  - this is specially needed for `<var>: <fulfilled class> = <object>`
  - this must also recurse into the structure of nested class and object, maybe even for pi type

- fix `evaluate` for `trivial_groupoid`

- [refactoring] `Telescope` use recursion instead of loop

- [refactoring] `Exps.Cls.infer` and `Exps.Ext.infer`

- [requirement] support to use `let` to do local definitions in class

- [refactoring] `check-library`
  - [requirement] `cic check-library` handle `.error.cic`

- vector/vector-ind
- vector/vector-ind -- syntax -- `vector_ind()`

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

# questions?

- what is the duality between introduction rule and elimination rule?
  (how to use introduction rule to generate elimination rule and all other rules?)
  - adjoint functors -- category theory

- how to read the formation rule, reading introduction rule and elimination rule as little book style laws?
- how to read the computation rule, reading eta rule and sameness rules as little book style commandments?

# cicada

- support to use TODO has hole

- [optimization] use native `number` as `Nat`

- [pattern matching] algebric datatype -- `datatype`
  - generate `ind`

# markdown support

- be able to embed cic code in markdown `.cic.md`

# library management

- [library] can be used as a module

# formalization

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
