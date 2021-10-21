---
title: Group Theory
author: Xie Yuheng
date: 2021-10-20
---

# Introduction

Group theory is often used in mathematics as a starting point for the
study of many algebraic structures, such as a set of numbers along
with its addition and multiplication. Because group theory is also
useful for studying symmetry in nature and abstract systems, it has
many applications in physics and chemistry.

# Semigroup

We build up our definition of group step by step,
from `Semigroup` to `Monoid` to `Group`.

A semigroup is simply a set together with an associative binary operation.
Only associative is required, nothing else.

``` cicada
class Semigroup {
  Element: Type
  mul(x: Element, y: Element): Element

  mul_associative(
    x: Element,
    y: Element,
    z: Element,
  ): Equal(
    Element,
    mul(x, mul(y, z)),
    mul(mul(x, y), z)
  )
}
```

# Monoid

Equipping `Semigroup` with identity element, we get `Monoid`.

``` cicada
class Monoid extends Semigroup {
  id: Element

  id_left(x: Element): Equal(Element, mul(id, x), x)
  id_right(x: Element): Equal(Element, mul(x, id), x)
}
```

# Group

Adding inversion operation and its axioms to `Monoid`, we get `Group`.

``` cicada
class Group extends Monoid {
  inv(x: Element): Element

  inv_left(x: Element): Equal(Element, mul(inv(x), x), id)
  inv_right(x: Element): Equal(Element, mul(x, inv(x)), id)

  div(x: Element, y: Element): Element {
    mul(x, inv(y))
  }
}
```
