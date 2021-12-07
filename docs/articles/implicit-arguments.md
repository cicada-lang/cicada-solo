---
title: Implicit arguments
author: Xie Yuheng
---

# Implicit function insertion

``` cicada
check! (x) => x: (implicit A: Type, A) -> A

// Elaboration
check! (implicit A, x) => x: (implicit A: Type, A) -> A
```

1. `(x) => x` is not an implicit function
2. Assume `A: Type` in context
3. Check `(x) => x` against `(A) -> A`
4. Return elaborated core expression `(implicit A, x) => x`

# Implicit application insertion

``` cicada
// Assume
function id(implicit A: Type, x: A): A {
  return x
}

// Infer
id("abc")

// Elaboration
id(implicit String, "abc")
```

1. Infer `(implicit A: Type, A) -> A` for `id`
2. The implicit `A` will be viewed as a pattern variable
3. Under the implicit pi, is the pi type `(A) -> A`
4. Infer `String` for `"abc"`
5. Unify `String` with `A` (the pi type's argument type)
6. Return elaborated core expression by reifying `id(implicit A, "abc")` to `id(implicit String, "abc")`
7. Return elaborated type by reifying `(A) -> A` to `(String) -> String`
   - We can do this by applying the closure to the solution of `A`

## What can go wrong

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

# Implicit application insertion in *check-mode*

We should distinguish between *check-mode* and *infer-mode* implicit arguments.

For check-mode implicit arguments,
we can implicit arguments from (and only from) return type.

We mark a pi type by the `vague` keyword
to denote it can only be elaborated in check-mode,
and such function application can not be curried.

``` cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}

// Assume
function my_list_cons(vague A: Type, head: A, tail: List(A)): List(A) {
  return List.cons(head, tail)
}

// Check
check! my_list_cons("abc", List.null): List(String)

// Elaboration
check! my_list_cons(vague String, "abc", List.null): List(String)
```

1. Infer `(vague A: Type, head: A, tail: List(A)) -> List(A)` for `my_list_cons`
2. Unify the given type `List(String)` with `List(A)` (the pi type's return type)
3. The solution of `A` is `String`
4. Return elaborated core expression by reifying `my_list_cons("abc", List.null)` to `my_list_cons(vague String, "abc", List.null)`

# Looking back

When we want to make something implicit, we use unification.

Examples:
- global type inference
- implicit function type
