# inductive datatype -- induction

- `induction-core` -- `apply` -- handle `target instanceof Exps.DataValue`

  - apply function of case entry to arguments

- `induction-core` -- `apply` -- handle `target instanceof Exps.NotYetValue`

# inductive datatype -- questions

- [question] Is it ok that `TypeCtorValue` can be `readback` to `TypeCtor`,
  while `DatatypeValue` and `CurriedTypeCtorValue` can only be `readback` to `ApCore`?

- [question] From the type of `List` -- `(E: Type) -> Type`,
  we know we can apply `List` to get a type,
  but we can also `List.null` & `List.cons` to get its constructors,
  should we and how should we show this in the type of `List`?

  - The same situation occurs for fulfilling type, which is of `Type`,
    but can also be applied to get partly fulfilled types.

# errors

- improve error classes

  - `SemanticError`
    - `ElaborationError`
    - `EvaluationError`
  - `InternalError`

# prelude

- a way to load prelude module

- make `the` and `is` function of prelude

# use `unify` to replace `readback`

- Value.unify -- pi/fn-value.ts & pi/implicit-fn-value.ts

  - bidirectional `unify`
  - handle eta-expansion in `unify`

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

# narration

- `exps/elaborate` -- narration
- `exps/todo` -- narration
- `exps/type` -- narration
- `exps/the` -- narration
- `exps/let` -- narration

- `exps/cls/cls-closure` -- narration
- `exps/cls/nil-cls` -- narration
- `exps/cls/fulfilled-cls` -- narration
- `exps/cls/dot` -- narration
- `exps/cls/obj` -- narration
- `exps/cls/cls` -- narration
- `exps/cls/cons-cls` -- narration
- `exps/cls/ext` -- narration

- `exps/sigma/car` -- narration
- `exps/sigma/cons` -- narration
- `exps/sigma/cdr` -- narration
- `exps/sigma/sigma` -- narration

- `exps/pi/ap` -- narration
- `exps/pi/fn` -- narration
- `exps/pi/pi` -- narration

- `exps/implicit-pi/implicit-ap-insertion` -- narration
- `exps/implicit-pi/implicit-pi` -- narration
- `exps/implicit-pi/implicit-fn-insertion` -- narration
- `exps/implicit-pi/implicit-fn` -- narration

- `exps/equal/refl` -- narration
- `exps/equal/the-same` -- narration
- `exps/equal/same` -- narration
- `exps/equal/replace` -- narration
- `exps/equal/same-as-chart` -- narration
- `exps/equal/equal` -- narration

- `exps/str/quote` -- narration
- `exps/str/str` -- narration

## inductive datatype

- `exps/absurd/absurd` -- narration
- `exps/absurd/absurd-ind` -- narration

- `exps/trivial/sole` -- narration
- `exps/trivial/trivial` -- narration

- `exps/nat/nat` -- narration
- `exps/nat/nat-ind` -- narration
- `exps/nat/zero` -- narration
- `exps/nat/add1` -- narration
- `exps/nat/nat-rec` -- narration

- `exps/list/list-rec` -- narration
- `exps/list/li` -- narration
- `exps/list/list-ind` -- narration
- `exps/list/list` -- narration
- `exps/list/nil` -- narration

- `exps/vector/vector-head` -- narration
- `exps/vector/vector-ind` -- narration
- `exps/vector/vector` -- narration
- `exps/vector/vecnil` -- narration
- `exps/vector/vec` -- narration
- `exps/vector/vector-tail` -- narration

- `exps/either/either` -- narration
- `exps/either/either-ind` -- narration
- `exps/either/inl` -- narration
- `exps/either/inr` -- narration

# quotient type

- learn from lean

# book manager

- [book manager] [cli] `cic install <user/repo@tag>` -- should not download existing packages
- [book manager] [cli] `cic install` -- download book from `references` specified in `book.json`
- [book manager] [cli] `cic init` -- learn from `npm init` and so on
- [book manager] be able to resolve module in book of `references`
  - we do not need to use book as module, we only need to be able to resolve module.

- [book manager] [cli] `cic install` -- `help`
- [book manager] [cli] `cic init` -- `help`

- [book manager] a syntax for addressing value by full path and name -- preparing for nominal typing

# books

- [books] [EWD1240a] A little bit of lattice theory
  - To test our system.
  - This paper is about the relation between PartialOrder and Lattice.
  - Learn from the story line for teaching.

- [book] formalize infinite descent as a consequence of induction on natural number:
  - https://en.wikipedia.org/wiki/Mathematical_induction#Infinite_descent
  - https://en.wikipedia.org/wiki/Proof_by_infinite_descent

- [book] formalize complete induction as a consequence of induction on natural number:
  - https://en.wikipedia.org/wiki/Mathematical_induction#Complete_(strong)_induction

- [books] Algebraic structures -- https://en.wikipedia.org/wiki/Algebraic_structure
- [books] Lattice theory
- [books] Closure system -- for FCA
- [books] Topology theory
- [books] Category of Groups
- [books] Number theroy -- https://en.wikipedia.org/wiki/Number_theory

# the `todo` keyword

- drop the `@` in the syntax of `TODO`

  - [maybe] use function application syntax

    - what is the type of `TODO` ?

# error report

- [problem] `exps/var` -- how to handle `span` when doing a `subst`?

# optimization

- [optimization] use native `BigInt` as `Nat`

  - learn from constraint logic programming (CLP)

# bug

- [bug] `induction` -- `build_case_t` -- fix the use of the generated names -- `motive` and `almost`

  - (A) is it enough to generate name that is not valid identifier?
  - (B) pass `free_names` from `TypeCtor` to `TypeCtorCore` and `TypeCtorValue`
  - (C) use `nanoid`

- [bug] When error is in an imported file, error report fail to report the right context.

- [bug] When `Valee.unify` take `ctx` and `t`, the `length` if `VecValue.unify` is wrong

- [bug] `11.md` -- the socpe of implicit argument `length` is wrong

  - if we move definition of `our_vector_ind` after `import { length } ...`,
    lexical scope will fail.

- [bug] fix type check error report on wrong number of elements

  in `07.md`:

  ``` cicada
  drop_last(String, 3, vec! ["1", "2", "3", "LAST"])
  drop_last(String, 3, vec! ["1", "2", "LAST"])
  ```

- `Book` -- the use of cached modules in `Book.load` is not safe in concurrent environment

# maybe

- [maybe] `implicit-fn` insertion is handled in `Fn.check`,
  but `vague-fn` insertion is handled in `check`,
  maybe we should make them symmetric.

- [maybe] currently `implicit-pi` and `vague-pi` has the same structure,
  only the inserters are different, if we need the third such feature,
  and the structures are still the same, we should do an abstraction (maybe `decorated-pi`).

- [maybe] we also need `multi-fn` & `multi-pi` to be symmetric with `multi-ap`

- [maybe] offset in `CodeBlock`
- [maybe] support using `let name = exp` to do local definitions in class

- [general macro] `li! [...]` and `vec! [...]` can be general macro,
  maybe `foldRight! (List.cons) [...]` and `foldRight! (Vector.cons) [...]`

- [maybe] extract `readback_type`
- [maybe] extract `ctx.extend_type`

# later

- [later] `Fn` be able to annotate argument type and return type
