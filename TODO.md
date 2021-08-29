# implicit

- Value.unify -- cls/cls-nil-value.ts
- Value.unify -- cls/cls-value.ts
- Value.unify -- cls/cls-cons-value.ts
- Value.unify -- cls/obj-value.ts
- Value.unify -- cls/cls-fulfilled-value.ts
- Value.unify -- sigma/cons-value.ts
- Value.unify -- sigma/sigma-value.ts
- Value.unify -- list/li-value.ts
- Value.unify -- list/list-value.ts
- Value.unify -- list/nil-value.ts
- Value.unify -- pi/fn-value.ts
- Value.unify -- pi/pi-value.ts
- Value.unify -- pi/pi-im-value.ts
- Value.unify -- pi/fn-im-value.ts
- Value.unify -- equal/equal-value.ts
- Value.unify -- equal/same-value.ts
- Value.unify -- vector/vector-value.ts
- Value.unify -- vector/vecnil-value.ts
- Value.unify -- vector/vec-value.ts
- Value.unify -- str/str-value.ts
- Value.unify -- str/quote-value.ts
- Value.unify -- nat/add1-value.ts
- Value.unify -- nat/nat-value.ts
- Value.unify -- nat/zero-value.ts
- Value.unify -- either/inr-value.ts

- Value.unify -- not-yet-value.ts

- `Subst.unify` occur check

- `Value.occur` handle each case

> 我之所以停在这里了
> - 因为目前 exps 太多了。
>   因此 inductive type 就很重要，
>   因为它可以用来实现大多数 exps，
>   并且大大地简化代码。
> - 因为我不确定我的实现的正确性。
>   因此更清晰的理解就很重要，
>   TDD 所带来的自信也很重要。
> - 因为我不确定目前的代码结构良好（比如关于 librarian）。
>   因此 OOD 就 refactoring 就很重要，
>   不断响应新的需求，才能检验代码的结构是否良好。

- we need unification over `Value` -- what should be the interface?
  - we need to reify `Value`
  - be careful when handling pi and sigma type's closure

- use implicit to implement `cong` by `replace`

- [question] Do we need `ap-im-neutral` and `fn-im-value`, or should just use  `ap-neutral` and `fn-value`?
   - (A) we keep `ap-im-neutral` and `fn-im-value` for now, remove them if needed in the future

- `exps/pi/fn` `check` insert `FnIm` on `PiIm`
  - The result of elab might also be `FnImCore`

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

# librarian?

- the `cicada-lang/librarian`'s library class is like a file system

  - this is complicated because of a module need to import other modules

    - this is like lazy mapping over the record of files,
      load it into module as needed.

    - one library denotes one source of files

      - local-library
      - github-library
      - gitlab-library

      how about we need to load from url, from a local module?

      how es6 module system does this?

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
