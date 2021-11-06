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

``` cicada
add(x: Nat, y: Nat): Nat {
  induction_nat(
    (_) => Nat,
    y,
    (_prev, almost) => add1(almost),
  ) (x)
}
```

``` cicada alternative
add_aux(x: Nat): (Nat) -> Nat {
  induction_nat(
    (_) => Nat,
    x,
    (_prev, almost) => add1(almost),
  )
}

add(x: Nat, y: Nat): Nat {
  add_aux(y, x)
}
```

``` cicada wishful-thinking
add(x: Nat, y: Nat): Nat {
  induction Nat {
    (_) => Nat
    case zero => y
    case add1(_prev, almost) => Nat.add1(almost.prev)
  } (x)
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

``` cicada
mul(x: Nat, y: Nat): Nat {
  induction_nat(
    (_) => Nat,
    0,
    (_prev, almost) => add(almost, y)
  ) (x)
}
```

``` cicada wishful-thinking
mul(x: Nat, y: Nat): Nat {
  induction Nat {
    (_) => Nat
    case zero => 0
    case add1(_prev, almost) => add(almost.prev, y)
  } (x)
}
```

``` cicada
same_as_chart! Nat [
  mul(4, 3),
  mul(3, 4),
  12,
]
```

# power_of & power

``` cicada
power_of(x: Nat, y: Nat): Nat {
  induction_nat(
    (_) => Nat,
    1,
    (_prev, almost) => mul(almost, y),
  ) (x)
}
```

``` cicada wishful-thinking
power(x: Nat, y: Nat): Nat {
  induction Nat {
    (_) => Nat
    case zero => 1
    case add1(_prev, almost) => mul(almost.prev, y)
  } (x)
}
```

``` cicada
power(base: Nat, n: Nat): Nat {
  power_of(n, base)
}
```

``` cicada
same_as_chart! Nat [
  power(4, 3),
  power_of(3, 4),
  64,
]
```

# gauss

``` cicada
gauss = induction_nat(
  (_) => Nat,
  0,
  (prev, almost) => add(add1(prev), almost),
)
```

``` cicada wishful-thinking
gauss = induction Nat {
  (_) => Nat
  case zero => 0
  case add1(prev, almost) => add(Nat.add1(prev), almost.prev)
}
```

``` cicada
same_as_chart! Nat [
  gauss(10),
  55,
]
```

# factorial

``` cicada
factorial = induction_nat(
  (_) => Nat,
  1,
  (prev, almost) => mul(add1(prev), almost),
)
```

``` cicada wishful-thinking
factorial = induction Nat {
  (_) => Nat
  case zero => 1
  case add1(prev, almost) => mul(Nat.add1(prev), almost.prev)
}
```

``` cicada
same_as_chart! Nat [
  factorial(5),
  120,
]
```
