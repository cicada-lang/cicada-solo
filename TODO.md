- [refactor] `check-library`

- [refactor] avoid using `Module.enter` -- also about `Module` `output`

- [cli] [refactor] cli is route, thus should be as simple as route

  - extract service? controller?

- [cli] `snapshot` in cli argument -- instead of in file name

- [cli] design simple command line interface

# implicit

- `exps/pi/pi-im` -- be able to take pi-im
- `exps/pi/fn-im` -- be able to take fn-im

- `exps/pi/fn` `check` insert `FnIm` on `PiIm`
  - The result of elab might also be `FnImCore`

- use implicit to implement `cong` by `replace` -- `from` and `to`

- [stdlib] try implicit argument in `stdlib`

- Value.unify -- pi/fn-value.ts & pi/fn-im-value.ts

  - typed directed `unify`
  - bidirectional `unify`
  - handle eta-expansion in `unify`

- Value.unify -- not-yet-value.ts

- Value.unify -- cls/cls-nil-value.ts
- Value.unify -- cls/cls-value.ts
- Value.unify -- cls/cls-cons-value.ts
- Value.unify -- cls/obj-value.ts
- Value.unify -- cls/cls-fulfilled-value.ts

- `Subst.unify` occur check

- `Value.occur` handle each case

# use `unify` to replace `readback`

# library

> Responding to new requirements can improve code structure.

> Learn patterns from web development.

- [library] can be used as a module

- `Module` improve architecture -- use use client / server

- `Module` improve architecture -- use request / response

  - note that, top-level syntax of `Module` is statement-oriented

- use relative path to resolve module

- support `@/` -- to resolve module by absolute path from current library

- the `Library` class is like a file system

  - support load library from a sub-dir of a repo -- to avoid using `git-subtree`

  - this is complicated because of a module need to import other modules

    - this is like lazy mapping over the record of files,
      load it into module as needed.

    - one library denotes one source of files

      - local-library
      - github-library
      - gitlab-library

      how about we need to load from url, from a local module?

      how es6 module system does this?

# error report

- learn from the request / response & client / server arch
- get information about location from parser
- good error report like elm
  - https://elm-lang.org/news/compiler-errors-for-humans
  - https://elm-lang.org/news/the-syntax-cliff

# git-based wiki system

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

- [requirement] support to use `let` to do local definitions in class
- [optimization] use native `number` as `Nat`

# syntax

- as our syntax become more and more complicated,
  we need to improve the API of `@cicada-lang/partech`,
  to manage the complexity.

- [maybe] as syntex to help "same-as" charts
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
