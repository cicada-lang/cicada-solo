---
title: Boolean Lattice
---

# BooleanLattice

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

  meet_commutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    meet(x, y),
    meet(y, x),
  )

  join_commutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    join(x, y),
    join(y, x),
  )

  top_is_identity_of_meet(
    x: Element
  ): Equal(
    Element,
    meet(x, top),
    x,
  )

  bottom_is_identity_of_join(
    x: Element
  ): Equal(
    Element,
    join(x, bottom),
    x,
  )

  meet_distribute_over_join(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    meet(x, join(y, z)),
    join(meet(x, y), meet(x, z)),
  )

  join_distribute_over_meet(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    join(x, meet(y, z)),
    meet(join(x, y), join(x, z)),
  )

  complement_meet_for_bottom(
    x: Element
  ): Equal(
    Element,
    meet(x, complement(x)),
    bottom,
  )

  complement_join_for_top(
    x: Element
  ): Equal(
    Element,
    join(x, complement(x)),
    top,
  )
}
```

# unique identity

```cicada
import { equal_swap, equal_compose } from "../equality/equal-utilities.md"

function join_unique_identity(
  lattice: BooleanLattice,
  o: lattice.Element,
  o_is_identity_of_join: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.join(x, o),
    x,
  ),
): Equal(lattice.Element, o, lattice.bottom) {
  check equal_swap(o_is_identity_of_join(lattice.bottom)): Equal(
    lattice.Element,
    lattice.bottom,
    lattice.join(lattice.bottom, o),
  )

  check lattice.join_commutative(lattice.bottom, o): Equal(
    lattice.Element,
    lattice.join(lattice.bottom, o),
    lattice.join(o, lattice.bottom),
  )

  check lattice.bottom_is_identity_of_join(o): Equal(
    lattice.Element,
    lattice.join(o, lattice.bottom),
    o,
  )

  return equal_swap(
    equal_compose(
      equal_swap(o_is_identity_of_join(lattice.bottom)),
      equal_compose(
        lattice.join_commutative(lattice.bottom, o),
        lattice.bottom_is_identity_of_join(o)),
    )
  )
}
```

# TODO

| Abbreviation | Full name       |
|--------------|-----------------|
| UId          | Unique Identity |
| Idm          | Idempotence     |
| Bnd          | Boundaries      |
| Abs          | Absorption law  |
| UNg          | Unique Negation |
| DNg          | Double negation |
| DMg          | De Morgan's Law |
| Ass          | Associativity   |

# absorption

```cicada
function meet_absorption(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, lattice.join(x, y)),
  x,
) {
  return TODO
  // return lattice.meet_distribute_over_join(x, x, y)
}

function join_absorption(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, lattice.meet(x, y)),
  x,
) {
  return TODO
}
```

# associative

```cicada

function meet_associative(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
  z: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, lattice.meet(y, z)),
  lattice.meet(lattice.meet(x, y), z),
) {
  return TODO
}

function join_associative(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
  z: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, lattice.join(y, z)),
  lattice.join(lattice.join(x, y), z),
) {
  return TODO
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
): Equal(
  BooleanLattice(Element),
  lattice,
  dual(dual(lattice)),
) {
  return refl
}
```

# Two-element Boolean algebra

<https://en.wikipedia.org/wiki/Two-element_Boolean_algebra>

TODO

```cicada

```
