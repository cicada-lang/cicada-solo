---
title: Integer as quotient type
author: Xie Yuheng
date: 2021-10-19
---

Firstly, we define `Integer` as a class (record type).

An integer is defined as a pair of natural numbers, `left` and `right`.
The intention of our definition, is to view the integer as equal to `left` minus `right`.

``` cicada
class Integer {
  left: Nat
  right: Nat
}
```

Secondly, we need the help of `add` to define the equivalence between `Integer`.

Given `x: Integer` and `y: Integer`.

We say `x` is equivalent to `y`,
iff `x.left` minus `x.right` is equal to `y.left` minus `y.right`,
after transposition, we have `add(x.left, y.right)` equal `add(y.left, x.right)`.

``` cicada
add(x: Nat, y: Nat): Nat {
  nat_rec(x, y, (_prev, almost) => add1(almost))
}

IntegerEqual(x: Integer, y: Integer): Type {
  Equal(Nat, add(x.left, y.right), add(y.left, x.right))
}
```

Example of equivalent integers:

``` cicada
the(
  IntegerEqual(
    { left: 10, right: 6 },
    { left: 11, right: 7 }),
  refl)
```

This concludes our demonstration of the basic idea of quotient type.

But to work with quotient types well,
we still need some helps from the language.
