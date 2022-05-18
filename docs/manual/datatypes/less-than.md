---
section: Datatype
---

# LessThan

```cicada
import { Nat, zero, add1 } from "./01-nat.md"

datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(zero, add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(add1(j), add1(k))
}

compute LessThan
compute LessThan(add1(zero))
compute LessThan(add1(zero), add1(add1(zero)))
```
