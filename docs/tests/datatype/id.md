---
title: Id
---

# Id

``` cicada
datatype Id(T: Type) (x: T, y: T) {
  my_refl(x: T): Id(T, x, x)
}
```

``` cicada
Id.my_refl
check! Id.my_refl(1): Id(Nat, 1, 1)
```
