---
section: Structure
title: Boolean Lattice
---

A [boolean lattice (or boolean algebra)](<https://en.wikipedia.org/wiki/Boolean_algebra_(structure)>)
is a _complemented distributive lattice_.

This type of algebraic structure
captures essential properties of
both set operations and logic operations.

```cicada
class BooleanLattice {
  Element: Type

  meet(x: Element, y: Element): Element
  join(x: Element, y: Element): Element
  complement(x: Element): Element

  top: Element
  bottom: Element

  meet_commutative(x: Element, y: Element): Equal(Element, meet(x, y), meet(y, x))
  join_commutative(x: Element, y: Element): Equal(Element, join(x, y), join(y, x))

  top_is_identity_of_meet(x: Element): Equal(Element, meet(x, top), x)
  bottom_is_identity_of_join(x: Element): Equal(Element, join(x, bottom), x)

  meet_absorption(x: Element, y: Element): Equal(Element, meet(x, join(x, y)), x)
  join_absorption(x: Element, y: Element): Equal(Element, join(x, meet(x, y)), x)

  meet_associative(x: Element, y: Element, z: Element): Equal(Element, meet(x, meet(y, z)), meet(meet(x, y), z))
  join_associative(x: Element, y: Element, z: Element): Equal(Element, join(x, join(y, z)), join(join(x, y), z))

  meet_distribute_over_join(
    x: Element, y: Element, z: Element
  ): Equal(Element, meet(x, join(y, z)), join(meet(x, y), meet(x, z)))

  join_distribute_over_meet(
    x: Element, y: Element, z: Element
  ): Equal(Element, join(x, meet(y, z)), meet(join(x, y), join(x, z)))

  complement_meet_for_bottom(x: Element): Equal(Element, meet(x, complement(x)), bottom)
  complement_join_for_top(x: Element): Equal(Element, join(x, complement(x)), top)
}
```

# dual

```cicada
function dual(
  implicit Element: Type,
  lattice: BooleanLattice(Element)
): BooleanLattice(Element) {
  return {
    Element,

    meet: lattice.join,
    join: lattice.meet,

    complement: lattice.complement,

    top: lattice.bottom,
    bottom: lattice.top,

    meet_commutative: lattice.join_commutative,
    join_commutative: lattice.meet_commutative,

    top_is_identity_of_meet: lattice.bottom_is_identity_of_join,
    bottom_is_identity_of_join: lattice.top_is_identity_of_meet,

    meet_absorption: lattice.join_absorption,
    join_absorption: lattice.meet_absorption,

    meet_associative: lattice.join_associative,
    join_associative: lattice.meet_associative,

    meet_distribute_over_join: lattice.join_distribute_over_meet,
    join_distribute_over_meet: lattice.meet_distribute_over_join,

    complement_meet_for_bottom: lattice.complement_join_for_top,
    complement_join_for_top: lattice.complement_meet_for_bottom,
  }
}
```

The `dual` of `BooleanLattice` is [involutive](<https://en.wikipedia.org/wiki/Involution_(mathematics)>).

```cicada
function dual_is_involutive(
  implicit Element: Type,
  lattice: BooleanLattice(Element)
): Equal(BooleanLattice(Element), lattice, dual(dual(lattice))) {
  return refl
}
```

# Two-element Boolean algebra

<https://en.wikipedia.org/wiki/Two-element_Boolean_algebra>

TODO

```cicada
```
