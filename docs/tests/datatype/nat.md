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

``` cicada
datatype MyNat {
  my_zero: MyNat
  my_add1(prev: MyNat): MyNat
}

MyNat
```

# induction Nat

``` cicada
induction_nat(
  target: Nat,
  motive: (Nat) -> Type,
  case_zero: motive(zero),
  case_add1: (
    prev: Nat,
    almost_on_prev: motive(prev),
  ) -> motive(add1(prev)),
): motive(target) {
  return nat_ind(target, motive, case_zero, case_add1)
}
```

# add

``` cicada
add(x: Nat, y: Nat): Nat {
  return induction_nat(
    x,
    (_) => Nat,
    y,
    (_prev, almost) => add1(almost),
  )
}
```

``` cicada wishful-thinking
add(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => y
    case add1(_prev, almost) => Nat.add1(almost.prev)
  }
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
  return induction_nat(
    x,
    (_) => Nat,
    0,
    (_prev, almost) => add(almost, y),
  )
}
```

``` cicada wishful-thinking
mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => 0
    case add1(_prev, almost) => add(almost.prev, y)
  }
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
  return induction_nat(
    x,
    (_) => Nat,
    1,
    (_prev, almost) => mul(almost, y),
  )
}
```

``` cicada wishful-thinking
power_of(x: Nat, y: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => 1
    case add1(_prev, almost) => mul(almost.prev, y)
  }
}
```

``` cicada
power(base: Nat, n: Nat): Nat {
  return power_of(n, base)
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
gauss(x: Nat): Nat {
  return induction_nat(
    x,
    (_) => Nat,
    0,
    (prev, almost) => add(add1(prev), almost),
  )
}
```

``` cicada wishful-thinking
gauss(x: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => 0
    case add1(prev, almost) => add(Nat.add1(prev), almost.prev)
  }
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
factorial(x: Nat): Nat {
  return induction_nat(
    x,
    (_) => Nat,
    1,
    (prev, almost) => mul(add1(prev), almost),
  )
}
```

``` cicada wishful-thinking
factorial(x: Nat): Nat {
  return induction (x) {
    (_) => Nat
    case zero => 1
    case add1(prev, almost) => mul(Nat.add1(prev), almost.prev)
  }
}
```

``` cicada
same_as_chart! Nat [
  factorial(5),
  120,
]
```
