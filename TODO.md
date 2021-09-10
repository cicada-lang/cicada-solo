# implicit

- fix `unify` return value -- should not be `Subst.null`

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

- `exps/pi/fn` `check` insert `FnIm` on `PiIm`
  - The result of elab might also be `FnImCore`

- use implicit to implement `cong` by `replace`

- [question] Do we need `ap-im-neutral` and `fn-im-value`, or should just use  `ap-neutral` and `fn-value`?
   - (A) we keep `ap-im-neutral` and `fn-im-value` for now, remove them if needed in the future

- `Subst.unify` occur check

- `Value.occur` handle each case

# use `unify` to replace `readback`

# library

- [library] can be used as a module

- 我不确定目前的代码结构良好（比如关于 librarian）。
  因此 OOD 就 refactoring 就很重要，
  不断响应新的需求，才能检验代码的结构是否良好。

- 学习 web development 的时候，尝试观察到所解决的问题，与程序语言实现中的问题之间的相似性，
  这样就可以将一个问题领域中的 pattern 用到另外一个问题领域。
  知道很多 pattern 重要，知道如何将 pattern 与 problem 匹配同样重要。

  - 这可能在于改善 Module，使得它变成 request / response 与 client / server 的感觉
    - 可能需要重新 inline librarian 这个 package
    - top-level syntax is statement-oriented

- module vs namespace?

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

- 目前 exps 太多了。
  因此 inductive type 就很重要，
  因为它可以用来实现大多数 exps，
  并且大大地简化代码。

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
