---
title: Fin
---

# Fin

``` cicada wishful-thinking
datatype Fin() (n: Nat) {
  zero(k: Nat): Fin(Nat.add1(k))
  add1(vague k: Nat, prev: Fin(k)): Fin(Nat.add1(k))
}
```
