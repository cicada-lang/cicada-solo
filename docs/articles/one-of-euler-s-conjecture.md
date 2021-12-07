---
title: One of Euler's conjecture
subtitle: An example from "Patterns of plausible inference"
---

``` cicada
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}

function add(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => y
    case add1(prev, almost) => Nat.add1(almost.prev)
  }
}

function mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => Nat.zero
    case add1(_prev, almost) => add(almost.prev, y)
  }
}

function Prime(n: Nat): Type {
  return @TODO "Prime"
}

let zero = Nat.zero
let one = Nat.add1(zero)
let two = Nat.add1(one)
let three = Nat.add1(two)
let four = Nat.add1(three)
let five = Nat.add1(four)
let six = Nat.add1(five)
let seven = Nat.add1(six)
let eight = Nat.add1(seven)
let nine = Nat.add1(eight)
let ten = Nat.add1(nine)

function euler_s_conjecture(n: Nat): [
  x: Nat, p: Nat, _: Prime(p) |
  Equal(
    Nat,
    add(mul(eight, n), three),
    add(mul(x, x), add(p, p))
  )
] {
  return @TODO "euler_s_conjecture"
}
```
