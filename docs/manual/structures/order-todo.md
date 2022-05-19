---
title: Order Theory
---

TODO How to model `StrictUnder`?

# StrictUnder

```
class StrictUnder {
  order: PreOrder
  x: order.Element
  y: order.Element
  strict: NonEqual(x, y)
  under: order.Under(x, y)
}
```

# PartialOrder

```
// NOTE No cycle.
// NOTE Can implement:
// - topological sort
class PartialOrder extends PreOrder {
  @given x: Element, y: Element
  antisymmetric(Under(x, y), Under(y, x)): Equal(x, y)
}
```

# Develop PartialOrder

```
// TODO PartialOrder should be an argument
@develop PartialOrder {
  // NOTE An alternative axiom for reflexive.
  // The advantage of this axiom is that it is the reverse of antisymmetric
  // - antisymmetric(Under(x, y), Under(y, x)): Equal(x, y)
  // Thus in PartialOrder, to prove Equal is equal to prove two Under's.
  // - Maybe easier to use.
  // - Maybe other axiom with one argument can have similar alternative.
  @given x: Element, y: Element
  reflexive_alt(Equal(x, y)): (Under(x, y), Under(y, x))
  reflexive_alt(equation) =
    (transport(equation, (z: Element) => Under(x, z), reflexive(x)),
      transport(Equal.swap(equation), (z: Element) => Under(y, z), reflexive(y)))

  // NOTE From the reflexivity of Under,
  // we derive the following laws,
  // known as the laws of "indirect order".
  indirect_order_under(
    x: Element, y: Element,
    (z: Element) -> Under(z, x) -> Under(z, y),
  ): Under(x, y)
  indirect_order_under = indirect_under(x, reflexive(x))

  indirect_order_above(
    x: Element, y: Element,
    (z: Element) -> Under(y, z) -> Under(x, z),
  ): Under(x, y)
  indirect_order_above(x, y, indirect_above) = indirect_above(y, reflexive(y))

  // TODO relation between PartialOrder and Lattice
  // (z: Element) -> (Under(w, z) <-> (Under(x, z), Under(y, z)))

}
```

# Beneath

```
class Beneath {
  order: PartialOrder
  x: order.Element
  y: order.Element
  strict_under: PreOrder.StrictUnder(order, x, y)
  nothing_in_between(
    z: Element,
    order.Under(x, z),
    PreOrder.StrictUnder(z, y),
  ): Equal(Element, z, x)
}
```
