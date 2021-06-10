- elab `super` in `Exps.Ext` to object with parent fields -- by `Exp.subst`

- fix for conversion check for ch15 `rest` when `prev` is `j`

  - we need to study scope more carefully

  - (A) use De Bruijn index
  - (B) use renaming to ensure that each entry in Γ has a distinct name
  - (C)
    - (1) [x] disallow top level redefinition statements
    - (2) [] keep ctx with distinct names, use `Exp.subst` to change variable name
    - (3) [] telescope contains information about renaming

- [tlt] 16. If It's All the Same to You

# style

- [style review] about naming convention,
  - in some case, we use type as postfix to name variable of this type,
    - `nat_equal_consequence_t` -- `_t` for `Type`
    - `incr_add1_equal` -- `_equal` for `Equal`

  - but in other case, we use type as prefix to name variable of this type,
    - `nat_equal_consequence_same` -- `nat_equal_consequence_` for `nat_equal_consequence_t`
    - `vec` & `vecnil` -- `vec` for `Vector`

# implicit

- [implicit] implement implicit by explicit `let`
- [implicit] use implicit to implement `cong` by `replace`

# subtype

- `check` use `subtype` instead of `conversion`
  - `subtype` should be implemented as a `subtype` function and `Value.subtype` method
  - `subtype` function default to `conversion`
  - `Value.subtype` call `subtype` for recursion

- when we do a typed binding, we need to be able to refine the declared type
  - this is specially needed for `<var>: <fulfilled class> = <object>`
  - this must also recurse into the structure of nested class and object, maybe even for pi type

# core features

- [refactoring] `Exps.Cls.infer` and `Exps.Ext.infer`
- [requirement] support to use `let` to do local definitions in class
- support to use `TODO("name-of-this-hole")` has hole
- [optimization] use native `number` as `Nat`
- [pattern matching] algebric datatype -- `datatype`
  - generate `ind`

# questions

- what is the duality between introduction rule and elimination rule?
  (how to use introduction rule to generate elimination rule and all other rules?)
  - adjoint functors -- category theory

- how to read the formation rule, reading introduction rule and elimination rule as little book style laws?
- how to read the computation rule, reading eta rule and sameness rules as little book style commandments?

# syntax

- [maybe] as syntex to help "same-as" charts
- [maybe] explicit `apply` -- to help non-elim in syntex
- [maybe] it will be good to have a form of explicit `same(x)` -- use `refl` for the zero argument version
  - this will not effect normalization, because `same(from)` and `same(to)` will always be definitional or computational equal.

# library management

- [library] can be used as a module

# formalization

- [formalization] a structure must have its own equivalence relation -- for quotient structure
  - structure should take `Equivalence` as argument
  - is the axioms of `Equivalence` enough to be used for quotient structure?

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
