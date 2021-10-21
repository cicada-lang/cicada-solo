---
title: Order Theory
author: Xie Yuheng
date: 2021-10-20
---

# Introduction

> Order theory is a branch of mathematics which investigates the
> intuitive notion of order using binary relations. It provides a formal
> framework for describing statements such as "this is less than that"
> or "this precedes that". This article introduces the field and
> provides basic definitions. A list of order-theoretic terms can be
> found in the order theory glossary.
>
> -- [Wikipedia / Order theory](https://en.wikipedia.org/wiki/Order_theory)

# PreOrder

Order theory focus on transitive binary relations,
we Start our definitions from a basic one -- `PreOrder`.

``` cicada
class PreOrder {
  Element: Type
  Under(Element, Element): Type

  reflexive(x: Element): Under(x, x)
  transitive(
    x: Element,
    y: Element,
    z: Element,
    Under(x, y),
    Under(y, z),
  ): Under(x, z)
}
```

A preorder is a thin category -- `hom_set(A, B).size <= 1`.

# PartialOrder

From `PreOrder`, we can add antisymmetric to get `PartialOrder`:

``` cicada
class PartialOrder extends PreOrder {
  antisymmetric(
    x: Element,
    y: Element,
    Under(x, y),
    Under(y, x),
  ): Equal(Element, x, y)
}
```

Note that, there will be no cycle in a partial order,
and we can implement topological sort for a partial order.

# Equivalence

From `PreOrder` again, we can get equivalence relation by adding symmetric.

``` cicada
class Equivalence extends PreOrder {
  symmetric(
    x: Element,
    y: Element,
    Under(x, y),
  ): Under(y, x)

  // TODO Maybe we should rename `Under` to `Eq`
  // Eq: Type = Under
}
```