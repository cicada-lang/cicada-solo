- [repl] `readline-repl` -- `.load` Load a file into the REPL session
- [repl] `readline-repl` -- indent inputed line by `depth`
- [repl] `readline-repl` -- should not erase last line on multi-line ctrl-c exit
- [repl] `readline-repl` -- `.save` -- save all statements vs save only good statements

- `base-im-pi-value` -- `isnert_im_ap` should not use `find_or_fail`

- [refactor] `base-im-pi-value` -- `isnert_im_ap`
- [refactor] `cons-im-pi-value` -- `isnert_im_ap`

- [refactor] `unify` of `Value`, `Neutral` and `Normal`

- `not-yet-value ` -- fix `unify`

- [maybe] merge `cons-im-pi` and `base-im-pi` back to `im-pi`

  - create `ImFnInserter` and `ImApInserter` from `im-pi`'s `ret_t`

# narrator of elaboration

- inject `Narrator` to `check` and `infer`

# error report

- [repl] fix not catched parsing error for repl
- [cli] improve validation and error report

- good error report like elm

  - https://elm-lang.org/news/compiler-errors-for-humans
  - https://elm-lang.org/news/the-syntax-cliff

- get information about location from parser

# git-based wiki system

# library manager

- library registry server
- download library from registry -- and cli support
- library can be used as a module  -- like package manager

# implicit

- Value.unify -- pi/fn-value.ts & pi/im-fn-value.ts

  - typed directed `unify`
  - bidirectional `unify`
  - handle eta-expansion in `unify`

- Value.unify -- not-yet-value.ts

- Value.unify -- cls/nil-cls-value.ts
- Value.unify -- cls/cls-value.ts
- Value.unify -- cls/cons-cls-value.ts
- Value.unify -- cls/obj-value.ts
- Value.unify -- cls/fulfilled-cls-value.ts

- `Subst.unify` occur check -- use `free_names`

- [stdlib] try implicit argument in `stdlib`

# use `unify` to replace `readback`

# refactor

- [refactor] `Reporter.error` -- take `path` or `text`?

# subtype

- `check` use `subtype` instead of `conversion`
  - `subtype` should be implemented as a `subtype` function and `Value.subtype` method
  - `subtype` function default to `conversion`
  - `Value.subtype` call `subtype` for recursion

- when we do a typed binding, we need to be able to refine the declared type
  - this is specially needed for `<var>: <fulfilled class> = <object>`
  - this must also recurse into the structure of nested class and object, maybe even for pi type

# inductive datatype

> Inductive type can reduce the number of exps.

- [inductive datatype] generate `ind` from `datatype` definitions

> questions

- what is the duality between introduction rule and elimination rule?
  (how to use introduction rule to generate elimination rule and all other rules?)
  - adjoint functors -- category theory

- how to read the formation rule, reading introduction rule and elimination rule as little book style laws?
- how to read the computation rule, reading eta rule and sameness rules as little book style commandments?

# quotient type

- learn from lean

# core features

- [requirement] support to use `=` to do local definitions in class
- [optimization] use native `number` as `Nat`

# syntax

- as our syntax become more and more complicated,
  we need to improve the API of `@cicada-lang/partech`,
  to manage the complexity.

- [maybe] design syntex to help "same-as" charts
- [maybe] explicit `apply` -- to help non-elim in syntex
- [maybe] it will be good to have a form of explicit `same(x)` -- use `refl` for the zero argument version
  - this will not effect normalization, because `same(from)` and `same(to)` will always be definitional or computational equal.

# stdlib

- [stdlib] `Set` -- Bishop's set theory -- with notes

- [stdlib] use `hom_set` in category theory
- [stdlib] prove theory about terminal object
- [stdlib] prove theory about initial object

- [stdlib] [EWD1240a] A little bit of lattice theory
  - To test our system.
  - This paper is about the relation between PartialOrder and Lattice.
  - Learn from the story line for teaching.

- [stdlib] Algebraic structures -- https://en.wikipedia.org/wiki/Algebraic_structure

- [stdlib] Lattice theory

- [stdlib] Closure system -- for FCA

- [stdlib] Topology theory

- [stdlib] Category of Groups

- [stdlib] Number theroy -- https://en.wikipedia.org/wiki/Number_theory
