---
title: Implicit arguments
author: Xie Yuheng
---

# Implicit lambda insertion

Check `(x) => x` against `(implicit A: Type, A) -> A`

1. `(x) => x` is not an implicit lambda
2. Assume `A: Type` in context
3. Check `(x) => x` against `(A) -> A`
4. Return `(implicit A, x) => x`

With closure (the argument name of a closure is unknown):

Check `(x) => x` against `(implicit Type) -> (closure A) => (A) -> A`

1. `(x) => x` is not an implicit lambda
2. Assume `fresh_name: Type` in context
3. Check `(x) => x` against `(fresh_name) -> fresh_name`
4. Return `(implicit fresh_name, x) => x`

# Implicit argument insertion

Assume `id: (implicit A: Type, A) -> A`

Infer `id(true)`

1. Infer `(implicit A: Type, A) -> A` for `id`
2. Insert appilication to fresh meta `id(a)`
3. Now we have `id(a): (a) -> a`
4. Check argument `true` against `a` -- we can not check
5. Infer `Bool` for `true`
5. Unify expected `a` type with `Bool`

Simple version (always infer argument):

1. Infer `(implicit A: Type, A) -> A` for `id`
2. The implicit `A` will be viewed as a pattern variable
3. Infer `Bool` for `true`
4. Unify expected `A` type with `Bool`
5. Reify `id(implicit A, true)` to be `id(implicit Bool, true)` and return it

With closure (the argument name of a closure is unknown):

Assume `id: (implicit Type) -> (closure A) => (A) -> A`

Infer `id(true)`

1. Infer `(implicit Type) -> (closure A) => (A) -> A` for `id`
2. Generate fresh pattern variable `V`
2. Apply `(closure A) => (A) -> A` to `V` to get `pi` -- `(V) -> V`
3. Infer `Bool` for `true`
4. Unify `pi.arg_t` -- `V` type with `Bool`
5. Reify `id(implicit V, true)` to be `id(implicit Bool, true)`
  - This Reify is simply the solution of `V`
6. Reify `(V) -> V` to be `(Bool) -> Bool`
  - We can do this reify by apply the closure to the solution of `V`
6. Return -- core: `id(Bool)(true)`, t: `(Bool) -> Bool`

Maybe we can simply use the `ctx` instead of `Reify`.

# What can go wrong

```
poly: Maybe((implicit A: Type, A) -> A) =
  just((x) => x)
```

1. Infer `(implicit a: Type, a) -> Maybe(a)` for `just`
2. Insert appilication to fresh meta `just(a)`
3. Now we have `just(a): (a) -> Maybe(a)`
2. Check `(x) => x` against `a`
3. Unknown checking type, thus we do not know what to insert
3. Infer `Maybe((b) -> b)` for `just((x) => x)`
4. Fail to unify with `Maybe((implicit A: Type, A) -> A)`

# Look back

When we want to make something implicit, we use unification.

Examples:
- global type inference
- implicit function type

# We should distinguish between check-mode and infer-mode implicit arguments

We also need to support implicit in check mode,
where we can pick up implicit arguments from return type.

TODO
