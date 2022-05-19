---
title: Semigroup with Built-in Associative
---

Instead of

```
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

How about

```cicada
import { List } from "../datatypes/list.md"

class Semigroup {
  Element: Type
  mul(List(Element)): Element
}
```

In which propositional equality in `mul_associative`
is transfered the definitional equality of `List`.

TODO how about `Monoid` and `Group`?

Is there a relation between

- the subclass relation between structures,

- and an unknown relation between inductive datatypes?
