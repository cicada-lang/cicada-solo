---
title: Natural number
---

# Nat

``` cicada
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}

Nat.zero

check! Nat.zero: Nat

Nat.add1

check! Nat: Type
check! Nat.zero: Nat
check! Nat.add1(Nat.zero): Nat
check! Nat.add1(Nat.add1(Nat.zero)): Nat
```

``` cicada
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
```

# induction Nat

``` cicada
function induction_nat(
  target: Nat,
  motive: (Nat) -> Type,
  case_of_zero: motive(Nat.zero),
  case_of_add1: (
    prev: Nat,
    almost: class { prev: motive(prev) },
  ) -> motive(Nat.add1(prev)),
): motive(target) {
  return induction (target) {
    motive
    case zero => case_of_zero
    case add1(prev, almost) => case_of_add1(prev, almost)
  }
}
```

# add

``` cicada
function add(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => y
    case add1(prev, almost) => Nat.add1(almost.prev)
  }
}
```

``` cicada
add(Nat.zero)
add(Nat.zero, Nat.zero)
add(Nat.zero, Nat.add1(Nat.zero))
add(Nat.add1(Nat.zero), Nat.zero)
add(Nat.add1(Nat.zero), Nat.add1(Nat.zero))
```

``` cicada
same_as_chart! (Nat) [
  add(
    Nat.add1(Nat.add1(Nat.zero)),
    Nat.add1(Nat.add1(Nat.add1(Nat.zero))),
  ),
  add(
    Nat.add1(Nat.add1(Nat.add1(Nat.zero))),
    Nat.add1(Nat.add1(Nat.zero)),
  ),
  Nat.add1(Nat.add1(Nat.add1(Nat.add1(Nat.add1(Nat.zero))))),
]
```

# mul

``` cicada
function mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => Nat.zero
    case add1(_prev, almost) => add(almost.prev, y)
  }
}
```

``` cicada
{
  let twelve = add(ten, two)
  return same_as_chart! (Nat) [
    mul(four, three),
    mul(three, four),
    twelve,
  ]
}
```

# power_of & power

``` cicada
function power_of(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(almost.prev, y)
  }
}
```

``` cicada
function power(base: Nat, n: Nat): Nat {
  return power_of(n, base)
}
```

``` cicada
same_as_chart! (Nat) [
  power(four, three),
  power_of(three, four),
  add(mul(six, ten), four),
]
```

# gauss

``` cicada
function gauss(x: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => Nat.zero
    case add1(prev, almost) => add(Nat.add1(prev), almost.prev)
  }
}
```

``` cicada
same_as_chart! (Nat) [
  gauss(ten),
  add(mul(five, ten), five),
]
```

# factorial

``` cicada
function factorial(x: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(Nat.add1(prev), almost.prev)
  }
}
```

``` cicada
same_as_chart! (Nat) [
  factorial(five),
  add(mul(ten, ten), mul(two, ten))
]
```
