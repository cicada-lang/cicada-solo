# inductive datatype

- [read] On the Meaning and Construction of the Rules in Martin-Löf's Theory of Types
- [read] Do-it-yourself Type Theory

> NOTE First finish a version of `TypeCtorValue`, revise it later when implementing `Ctor`

- `TypeCtorValue` -- `readback`

- `TypeCtorValue` -- `self_type`

- `TypeCtorValue` -- `readback_parameters`
- `TypeCtorValue` -- `readback_indexes`
- `TypeCtorValue` -- `readback_ctors`

  - extends `ctx` with `not-yet-value`, to support recursive definition while avoiding infinite loop.

- `TypeCtorValue` -- `evaluate_parameters`
- `TypeCtorValue` -- `evaluate_indexes`
- `TypeCtorValue` -- `evaluate_ctors`

- `TypeCtorValue` -- `unify`

- `TypeCtor` test by `Show`

- `TypeCtor` -- be able to apply to arguments and get `Datatype`
  - `ap` interface

- `Datatype`

- `Ctor` -- use a `parameters` field -- maybe we do not need check-mode implicit arguments to implement `Ctor`
- `Ctor` -- use `<type-ctor>.<ctor>` to get constructors
  - `dot` interface
  - a constructor can be curried during application

- `DataValue`
- `DataCore` -- structural typing (data contains datatype)

# syntax

- `Exps.Begin` for code block `{ ... }`

  - contains list of stmt

    - `Exps.LetStmt` -- elaboration to `Exps.Let`
    - `Exps.ShowStmt` -- will be checked (inferred) by dropped during elaboration
    - `Exps.ReturnStmt`

  - support show in code block,
    to use `is(inl(x), Either(A, (A) -> B))`,
    instead of `_ = is(inl(x), Either(A, (A) -> B))`

# implicit argument in check mode

- be able to solve implicit arguments from return type

  - an implicit function that only has implicit arguments can be used as value

    - we do not have zero-arity function, we use `c` instead of `c()`

  - insert implicit function in data constructor
    - examples: `nil`, `vecnil`

  - we can fix `either.md`'s `list_ref`

# prelude

- a way to load prelude module

- make `the` and `is` function of prelude

# use `unify` to replace `readback`

- Value.unify -- pi/fn-value.ts & pi/im-fn-value.ts

  - typed directed `unify`
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

- `exps/im-pi/im-ap-insertion` -- narration
- `exps/im-pi/im-pi` -- narration
- `exps/im-pi/im-fn-insertion` -- narration
- `exps/im-pi/im-fn` -- narration

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

# narration

- `@elab` support `@elab(<name>, <exp>)`

  - maybe use this to fix repeated output of `@elab`

- narration for the computation rules

  - eta rule & sameness rule

  - These rules can not be narrated in our implementation of NbE,
    maybe will be able to narrate them, if we use unification instead of NbE.

# error report

- [problem] `exps/var` -- how to handle `span` when doing a `subst`?

# optimization

- [optimization] use native `BigInt` as `Nat`

  - learn from constraint logic programming (CLP)

# bug

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

- [maybe] offset in `CodeBlock`
- [maybe] support using `let name = exp` to do local definitions in class

- [general macro] `li! [...]` and `vec! [...]` can be general macro,
  maybe `foldRight! (List.cons) [...]` and `foldRight! (Vecotr.cons) [...]`

# later

- [later] `Fn` be able to annotate argument type and return type
