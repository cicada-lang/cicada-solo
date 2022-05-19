---
title: Order Theory
---

# Introduction

> Order theory is a branch of mathematics which investigates the
> intuitive notion of order using binary relations. It provides a formal
> framework for describing statements such as "this is less than that"
> or "this precedes that".
>
> -- [Wikipedia / Order theory](https://en.wikipedia.org/wiki/Order_theory)

# PreOrder

Order theory focus on transitive binary relations,
we start our definitions from a basic one -- `PreOrder`.

```cicada
import { Not } from "../logic/basic.cic"

class PreOrder {
  Element: Type

  Under(Element, Element): Type

  reflexive(x: Element): Under(x, x)

  transitive(
    implicit x: Element,
    implicit y: Element,
    Under(x, y),
    implicit z: Element,
    Under(y, z),
  ): Under(x, z)

  NotComparable(x: Element, y: Element): Type {
    return Both(Not(Under(x, y)), Not(Under(y, x)))
  }
}
```

A preorder is a thin category -- `hom_set(A, B).size <= 1`.

# Order

From `PreOrder`, we can add antisymmetric to get `Order`:

```cicada
class Order extends PreOrder {
  antisymmetric(
    implicit x: Element,
    implicit y: Element,
    Under(x, y),
    Under(y, x),
  ): Equal(Element, x, y)
}
```

Note that, there will be no cycle in a partial order,
and we can implement topological sort for a partial order.

# TotalOrder

```cicada
import { Either } from "../datatypes/either.md"

class TotalOrder extends Order {
  totality(x: Element, y: Element): Either(Under(x, y), Under(y, x))
}
```

# Equivalence

From `PreOrder` again, we can get equivalence relation by adding symmetric.

```cicada
class Equivalence extends PreOrder {
  symmetric(
    implicit x: Element,
    implicit y: Element,
    Under(x, y),
  ): Under(y, x)

  // TODO Maybe we should rename `Under` to `Eq`
  // Eq: Type = Under
}
```
