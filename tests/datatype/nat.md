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

# add, mul & pow

``` cicada wishful-thinking
add(x: Nat, y: Nat): Nat {
  induction Nat {
    (_) => Nat

    case zero => y
    case add1(_prev, almost) => add1(almost)
  } (x)
}

add(x: Nat): (Nat) -> Nat {
  recursion Nat {
    case zero => x
    case add1(_prev, almost) => add1(almost)
  }
}

mul(x: Nat, y: Nat): Nat {
  nat_rec(x, 0, (_prev, almost) => add(almost, y))
}

pow(x: Nat, y: Nat): Nat {
  nat_rec(x, 1, (_prev, almost) => mul(almost, y))
}

gauss(n: Nat): Nat {
  nat_rec(n, 0, (prev, almost) => add(add1(prev), almost))
}

factorial(n: Nat): Nat {
  nat_rec(n, 1, (prev, almost) => mul(add1(prev), almost))
}
```
