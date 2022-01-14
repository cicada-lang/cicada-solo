---
section: Equality
title: Equal Utilities
---

To understand `Equal` better,
let's write some helper functions for it.

## equal_map

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
