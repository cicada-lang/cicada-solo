---
section: Datatype
---

# Fin

```cicada
import { Nat } from "./01-nat.md"

datatype Fin() (n: Nat) {
  zero(k: Nat): Fin(Nat.add1(k))
  add1(vague k: Nat, prev: Fin(k)): Fin(Nat.add1(k))
}

Fin.zero
Fin.add1
```
