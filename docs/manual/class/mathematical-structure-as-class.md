---
title: Mathematical Structure as Class
---

[Mathematical structures](https://en.wikipedia.org/wiki/Mathematical_structure)
(specially [algebraic structures](https://en.wikipedia.org/wiki/Algebraic_structure))
can be formalized as classes in our language.

Take the most simple algebraic structure -- **semigroup** -- as a exmaple.

A [semigroup](https://en.wikipedia.org/wiki/Semigroup) is

- a set -- `Element: Type`,
- a binary operation -- `mul`,
- an a proof that the binary operation is associative -- `mul_associative`.

```cicada
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

See [structures/group.md](../structures/group.md) for more examples.
