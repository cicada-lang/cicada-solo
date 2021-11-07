---
title: LessThan
---

# LessThan

``` cicada wishful-thinking
datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(Nat.zero, Nat.add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(Nat.add1(j), Nat.add1(k))
}
```
