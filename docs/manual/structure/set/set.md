---
title: Bishop's Set Theory
author: Xie Yuheng
date: 2021-10-20
---

# Set

> A set is not an entity which has an ideal existence.
> A set exists only when it has been defined.
>
> To define a set we prescribe, at least implicitly,
>
> 1. what we (the constructing intelligence) must do
>    in order to construct an element of the set,
> 2. and what we must do to show that
>    two elements of the set are equal.
>
> -- Errett Bishop, A Constructivist Manifesto

```cicada
class Set {
  Element: Type
  Eq(Element, Element): Type

  reflexive(x: Element): Eq(x, x)

  transitive(
    implicit x: Element,
    implicit y: Element,
    Eq(x, y),
    implicit z: Element,
    Eq(y, z),
  ): Eq(x, z)

  symmetric(
    implicit x: Element,
    implicit y: Element,
    Eq(x, y),
  ): Eq(y, x)
}
```
