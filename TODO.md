- a structure must have its own equivalence relation -- for quotient structure
  - structure should take `Equivalence` as argument
  - is the axioms of `Equivalence` enough to be used for quotient structure?

- [refactoring] `check-library`
  - code block's output should correspond to the code block
    - a module know its list of stmts, and associate output of a stmt to the stmt
    - file is too low level a concept,
      we should use "iterator (stream) of stmts" instead,
      which will generalize:
      - cic file
      - md file and stmts in its code blocks
      - REPL

- about built-in test framework

  - we might not use `.error.cic` `.snapshot.cic`
    because we need to support code block in markdown

  - `cic check-library` handle `.error.cic`

- [markdown] be able to embed cic code in markdown `.cic.md`
  - be able to distinguish in-site links from external links
  - be able to generate TOC

- [tlt] 10. It Also Depends On the List
- [tlt] 11. All Lists Are Created Equal
- [tlt] 12. Even Numbers Can Be Odd
- [tlt] 13. Even Haf a Baker's Dozen
- [tlt] 14. There's Safety in Numbers
- [tlt] 15. Imagine That ...
- [tlt] 16. If It's All the Same to You

- it will be good to have a form of explicit `same(x)` -- use `refl` for the zero argument version

- `check` use `subtype` instead of `conversion`
  - `subtype` should be implemented as a `subtype` function and `Value.subtype` method
  - `subtype` function default to `conversion`
  - `Value.subtype` call `subtype` for recursion

- `Exp.subst`

- should we have a `Exp.subexps` interface (readonly query for sub-expressions)?

- elab `super` in `Exps.Ext` to object with parent fields -- by `Exp.subst`

- when we do a typed binding, we need to be able to refine the declared type
  - this is specially needed for `<var>: <fulfilled class> = <object>`
  - this must also recurse into the structure of nested class and object, maybe even for pi type

- [maybe] elaborate `cong` to `replace`

- [refactoring] `Exps.Cls.infer` and `Exps.Ext.infer`

- [requirement] support to use `let` to do local definitions in class

- vector/vector-ind
- vector/vector-ind -- syntax -- `vector_ind()`

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

# cicada-stoa

- with oauth
- be able to use github and gitlab as wiki's database
  - one repo one group of pages
  - edit => fork + PR + help from merger bot
