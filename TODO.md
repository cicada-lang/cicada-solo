- `subst_exp`

- elab `super` in `Exps.Ext` to object with parent fields

- elab `Exps.Ext` to `Cores.Cls`

- use `subtype` instead of `conversion`

- elab the type of obj to be fulfilled class

- fix `@show trivial_groupoid`

- before dis-allowing `super`, test class with examples.

- `Groupoid` should not extends `Category`, use `Groupoid.as_category` instead.

- [problem] I do not know how to define `Telescope` as a recursive data type, and use recursive functions to handle it.
  - I think I need to separate `Telescope` into `fulfilled` and `Scope`, where `Scope` is recursive data type.
  - Maybe because my recursion skills are rusty now. (I can re-read "The Little Schemer", and "The Seasoned Schemer")

- [refactoring] instead of [pull up field [through composition]] maybe we should split `Telescope`

- [refactoring] [pull up field [through composition]] -- `Telescope.fulfilled` to `ClsValue`
- [refactoring] [pull up field [through composition]] -- `Telescope.fulfilled` to `ExtValue`

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
