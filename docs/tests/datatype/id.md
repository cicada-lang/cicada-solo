---
title: Id
---

# Id

``` cicada
datatype Id(T: Type) (from: T, to: T) {
  reflection(vague x: T): Id(T, x, x)
}
```

``` cicada
Id.reflection
check! Id.reflection: Id(String, "a", "a")
```

# id_replace

TODO Can we use `induction` to define `id_replace` -- just like `replace` for `Equal`?

``` cicada todo
function id_replace(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  id: Id(X, from, to),
  motive: (X) -> Type,
  base: motive(from),
): motive(to) {
  return induction (id) {
    (from, to, target) => motive(to)
    case reflection(vague x) => base
  }
}

// ERROR on `base`:
// I infer the type to be:
//   motive(from)
// But the expected type is:
//   motive(x)
```
