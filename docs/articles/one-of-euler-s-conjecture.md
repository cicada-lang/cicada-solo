---
title: One of Euler's conjecture
subtitle: An example from "Patterns of plausible inference"
---

``` cicada
function add(x: Nat, y: Nat): Nat {
  return nat_rec(x, y, (_prev, almost) => {
    return add1(almost)
  })
}

function mul(x: Nat, y: Nat): Nat {
  return nat_rec(x, 0, (_prev, almost) => {
    return add(almost, y)
  })
}

function Prime(n: Nat): Type {
  return @TODO "Prime"
}

function euler_s_conjecture(n: Nat): [
  x: Nat, p: Nat, _: Prime(p) |
  Equal(
    Nat,
    add(mul(8, n), 3),
    add(mul(x, x), add(p, p))
  )
] {
  return @TODO "euler_s_conjecture"
}
```
