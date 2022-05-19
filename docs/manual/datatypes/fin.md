---
title: Fin
---

# Fin

```cicada
import { Nat } from "./nat.md"

datatype Fin() (n: Nat) {
  zero(k: Nat): Fin(Nat.add1(k))
  add1(vague k: Nat, prev: Fin(k)): Fin(Nat.add1(k))
}

compute Fin.zero
compute Fin.add1
```
