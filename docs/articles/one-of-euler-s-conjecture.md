---
title: One of Euler's conjecture
subtitle: An example from "Patterns of plausible inference"
---

``` cicada
add: (Nat, Nat) -> Nat = (x, y) => {
  return nat_rec(x, y, (_prev, almost) => {
    return add1(almost)
  })
}

mul: (Nat, Nat) -> Nat = (x, y) => {
  return nat_rec(x, 0, (_prev, almost) => {
    return add(almost, y)
  })
}

Prime(n: Nat): Type {
  return @TODO "Prime"
}

euler_s_conjecture(n: Nat): there exists [
  x: Nat, p: Nat, _: Prime(p) such that
  Equal(
    Nat,
    add(mul(8, n), 3),
    add(mul(x, x), add(p, p))
  )
] {
  return @TODO "euler_s_conjecture"
}
```
