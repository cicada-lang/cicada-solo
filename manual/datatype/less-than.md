---
section: Datatype
---

# LessThan

``` cicada
import { Nat } from "./01-nat.md"

datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(Nat.zero, Nat.add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(Nat.add1(j), Nat.add1(k))
}

LessThan
LessThan(Nat.add1(Nat.zero))
LessThan(Nat.add1(Nat.zero), Nat.add1(Nat.add1(Nat.zero)))
```
