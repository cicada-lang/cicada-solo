---
section: Datatype
title: MyEqual
---

# MyEqual

``` cicada
datatype MyEqual(T: Type) (from: T, to: T) {
  refl(vague x: T): MyEqual(T, x, x)
}
```

``` cicada
MyEqual.refl
check! MyEqual.refl: MyEqual(String, "a", "a")
```

# my_equal_replace

TODO Can we use `induction` to define `my_equal_replace` -- just like `replace` for `Equal`?

``` cicada todo
function my_equal_replace(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  my_equal: MyEqual(X, from, to),
  motive: (X) -> Type,
  base: motive(from),
): motive(to) {
  return induction (my_equal) {
    (from, to, target) => motive(to)
    case refl(vague x) => base
  }
}

// ERROR on `base`:
// I infer the type to be:
//   motive(from)
// But the expected type is:
//   motive(x)
```
