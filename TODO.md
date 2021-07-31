# implicit

- `exps/pi/ap-im` -- `free_names`
- `exps/pi/ap-im` -- `subst`
- `exps/pi/ap-im` -- `infer`
- `exps/pi/ap-im` -- `repr`

- `exps/pi/ap-im-core`
- `exps/pi/ap-im-value`

- `exps/pi/fn` `check` insert `FnIm` on `PiIm`
- `exps/pi/ap` `infer` insert `ApIm` on `PiIm`

- `exps/pi/pi-im-value` -- `eta_expand`

- `exps/pi/pi-im` -- syntax -- only over pi `(given x: A, y: B(x)) -> C(x)`
- `exps/pi/fn-im` -- syntax  -- `(given x, y) { z(x) }`
- `exps/pi/ap-im` -- syntax  -- `f(given x)`

- we need unification over `Value` -- what should be the interface?
  - we need to reify `Value`
  - be careful when handling pi and sigma type's closure

- use implicit to implement `cong` by `replace`

# later

- [later] update `cicada-lang/cicada-studyroom`

# subtype

- `check` use `subtype` instead of `conversion`
  - `subtype` should be implemented as a `subtype` function and `Value.subtype` method
  - `subtype` function default to `conversion`
  - `Value.subtype` call `subtype` for recursion

- when we do a typed binding, we need to be able to refine the declared type
  - this is specially needed for `<var>: <fulfilled class> = <object>`
  - this must also recurse into the structure of nested class and object, maybe even for pi type

# inductive datatype

- [inductive datatype] generate `ind` from `datatype` definitions

> questions

- what is the duality between introduction rule and elimination rule?
  (how to use introduction rule to generate elimination rule and all other rules?)
  - adjoint functors -- category theory

- how to read the formation rule, reading introduction rule and elimination rule as little book style laws?
- how to read the computation rule, reading eta rule and sameness rules as little book style commandments?

# core features

- [refactoring] `Exps.Cls.infer` and `Exps.Ext.infer`
- [requirement] support to use `let` to do local definitions in class
- [optimization] use native `number` as `Nat`

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
