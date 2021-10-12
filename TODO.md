- `ctx` -- `CtxObserver`

- `ctx.narration`

  - `ctx.send` -- `{ tag: "narration", msg: "..." }`

- use `ctx.narration` to send event to `CtxObserver`

# narration

- `exps/*` -- narration

- narration the formation rules

  - introduction rule & elimination rule

- narration for the computation rules

  - eta rule & sameness rule

  - These rules can not be narrated in our implementation of NbE,
    maybe will be able to narrate them, if we use unification instead of NbE.

# core features

- support to use `=` to do local definitions in class

- `Fn` be able to annotate argument type and return type

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

# book manager

- [book manager] [cli] download book from `references` specified in `book.json`

- [book manager] be able to resolve module in book of `dependencies`

  - we do not need to use book as module,
    we only need to be able to resolve module.

# error report

- [problem] `exps/var` -- how to handle `span` when doing a `subst`?

# optimization

- [optimization] use native `BigInt` as `Nat`

  - learn from constraint logic programming (CLP)

# bug

- `Book` -- the use of cached modules in `Book.load` is not safe in concurrent environment
