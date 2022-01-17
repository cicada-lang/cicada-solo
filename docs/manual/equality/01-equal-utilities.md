---
section: Equality
title: Equal Utilities
---

> **Works on this chapter is not finished yet.**

In the chapter [Proving Theorems About Nat](../datatype/01.1-proving-theorems-about-nat.md),
we used some helper functions about `Equal`,
to prove the **commutative property of addition** for natural number.

The usage of these helper functions are very intuitive,
because we are very familiar with reasoning about equations.

And the definition of these helper functions can also be intuitive,
once we understood a built-in function called `replace`.

It expresses a common sense,

> If two things are the same, they can replace each other.

# equal_map

``` cicada
function equal_map(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Equal(X, from, to),
  implicit Y: Type,
  f: (X) -> Y,
): Equal(Y, f(from), f(to)) {
  return replace(
    target,
    (x) => Equal(Y, f(from), f(x)),
    refl,
  )
}
```

# equal_swap

``` cicada
function equal_swap(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  xy_equal: Equal(A, x, y),
): Equal(A, y, x) {
  return replace(
    xy_equal,
    (w) => Equal(A, w, x),
    refl,
  )
}
```

# equal_compose

``` cicada
function equal_compose(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  xy_equal: Equal(A, x, y),
  implicit z: A,
  yz_equal: Equal(A, y, z),
): Equal(A, x, z) {
  return replace(
    yz_equal,
    (w) => Equal(A, x, w),
    xy_equal,
  )
}
```

------

# Summary

Written these helper functions definitely helped us
understand the natural of `Equal` better.

Equality is also one of the most important concept in type theory,
which still carries some mysteries remain to be solved.
