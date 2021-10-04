# error report

- exps/equal/replace -- with `span`
- exps/equal/same-as-chart -- with `span`
- exps/equal/equal -- with `span`

- exps/let -- with `span`

- exps/var -- with `span`

- `Trace` use `meta.span` when `exp` has `meta`

  - [maybe] rename `Trace` to `ExpTrace`

  - improve structure of error:

    - kind
    - context
    - message
    - hint

- exps/cls/nil-cls -- with `span`
- exps/cls/fulfilled-cls -- with `span`
- exps/cls/dot -- with `span`
- exps/cls/obj -- with `span`
- exps/cls/cls -- with `span`
- exps/cls/cons-cls -- with `span`
- exps/cls/ext -- with `span`

- exps/sigma/car -- with `span`
- exps/sigma/cons -- with `span`
- exps/sigma/cdr -- with `span`
- exps/sigma/sigma -- with `span`

- exps/pi/ap -- with `span`
- exps/pi/fn -- with `span`
- exps/pi/pi -- with `span`

- exps/im-pi/im-pi -- with `span`
- exps/im-pi/im-fn -- with `span`

- `parser/matchers` fix not catched parsing error -- for repl

# narrator of elaboration

- inject `Narrator` to `check` and `infer`

  - how to read the formation rule, reading introduction rule and elimination rule as little book style laws?
  - how to read the computation rule, reading eta rule and sameness rules as little book style commandments?

# core features

- support to use `=` to do local definitions in class

- `Fn` be able to annotate argument type and return type

- [optimization] use native `number` as `Nat`

# implicit

- [refactor] `unify` of `Value`, `Neutral` and `Normal`

- `not-yet-value ` -- fix `unify`

- [stdlib] try implicit argument in `stdlib`

  - `category/implicit`

# use `unify` to replace `readback`

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

# quotient type

- learn from lean

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

# library manager

- [library manager] [cli] download library from registry

  - `libraries.cicada-lang.com`
  - `registry.cicada-lang.com`

- [library manager] be able to resolve module in library of `dependencies`

  - we do not need to use library as module,
    we only need to be able to resolve module.
