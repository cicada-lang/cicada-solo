---
title: Natural number
---

# Nat

``` cicada wishful-thinking
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}
```

# induction Nat

``` cicada
induction_nat(
  motive: (Nat) -> Type,
  case_zero: motive(zero),
  case_add1: (
    prev: Nat,
    almost_on_prev: motive(prev),
  ) -> motive(add1(prev)),
  target: Nat,
): motive(target) {
  nat_ind(target, motive, case_zero, case_add1)
}
```

# add

``` cicada wishful-thinking
add(x: Nat): (Nat) -> Nat {
  induction Nat {
    (_) => Nat
    case zero => x
    case add1(_prev, almost) => add1(almost)
  }
}
```

``` cicada
add(x: Nat): (Nat) -> Nat {
  induction_nat (
    (_) => Nat,
    x,
    (_prev, almost) => add1(almost),
  )
}
```

``` cicada
same_as_chart! Nat [
  add(4, 3),
  add(3, 4),
  7,
]
```

# mul

``` cicada wishful-thinking
mul(x: Nat): (Nat) -> Nat {
  induction Nat {
    (_) => Nat
    case zero => 0
    case add1(_prev, almost) => add(almost, x)
  }
}
```

``` cicada
mul(x: Nat): (Nat) -> Nat {
  induction_nat(
    (_) => Nat,
    0,
    (_prev, almost) => add(almost, x)
  )
}
```

``` cicada
same_as_chart! Nat [
  mul(4, 3),
  mul(3, 4),
  12,
]
```

# pow

``` cicada wishful-thinking
pow(x: Nat, y: Nat): Nat {
  nat_rec(x, 1, (_prev, almost) => mul(almost, y))
}
```

# gauss

``` cicada wishful-thinking
gauss(n: Nat): Nat {
  nat_rec(n, 0, (prev, almost) => add(add1(prev), almost))
}
```

# factorial

``` cicada wishful-thinking
factorial(n: Nat): Nat {
  nat_rec(n, 1, (prev, almost) => mul(add1(prev), almost))
}
```
