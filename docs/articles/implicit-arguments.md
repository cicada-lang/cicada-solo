---
title: Implicit arguments
author: Xie Yuheng
---

# Implicit function insertion

``` cicada
check! (x) => x: (implicit A: Type, A) -> A

// Elaborate to:
check! (implicit A, x) => x: (implicit A: Type, A) -> A
```

1. `(x) => x` is not an implicit function
2. Assume `A: Type` in context
3. Check `(x) => x` against `(A) -> A`
4. Return elaborated core expression `(implicit A, x) => x`

# Implicit application insertion

``` cicada
// Assume
let id: (implicit A: Type, A) -> A = (implicit A, x) => x

// Infer
id(123)

// Elaborate to:
id(implicit Nat, 123)
```

1. Infer `(implicit A: Type, A) -> A` for `id`
2. The implicit `A` will be viewed as a pattern variable
3. Under the implicit pi, is the pi type `(A) -> A`
3. Infer `Nat` for `123`
4. Unify `Nat` with `A` (the pi type's argument type)
6. Return elaborated core expression by reifying `id(implicit A, 123)` to `id(implicit Nat, 123)`
7. Return elaborated type by reifying `(A) -> A` to `(Nat) -> Nat`
   - We can do this by applying the closure to the solution of `A`

# What can go wrong

``` cicada counterexample
let poly: Maybe((implicit A: Type, A) -> A) =
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

We also need to support implicit in check-mode,
where we can pick up implicit arguments from return type.

TODO
