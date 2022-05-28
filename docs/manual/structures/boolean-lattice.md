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

  join(x: Element, y: Element): Element
  meet(x: Element, y: Element): Element

  complement(x: Element): Element

  bottom: Element
  top: Element

  join_is_commutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    join(x, y),
    join(y, x),
  )

  meet_is_commutative(
    x: Element,
    y: Element,
  ): Equal(
    Element,
    meet(x, y),
    meet(y, x),
  )

  bottom_is_identity_of_join(
    x: Element
  ): Equal(
    Element,
    join(x, bottom),
    x,
  )

  top_is_identity_of_meet(
    x: Element
  ): Equal(
    Element,
    meet(x, top),
    x,
  )

  join_can_distribute_over_meet(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    join(x, meet(y, z)),
    meet(join(x, y), join(x, z)),
  )

  meet_can_distribute_over_join(
    x: Element,
    y: Element,
    z: Element
  ): Equal(
    Element,
    meet(x, join(y, z)),
    join(meet(x, y), meet(x, z)),
  )

  complement_join_for_top(
    x: Element
  ): Equal(
    Element,
    join(x, complement(x)),
    top,
  )

  complement_meet_for_bottom(
    x: Element
  ): Equal(
    Element,
    meet(x, complement(x)),
    bottom,
  )
}
```

# Duality

```cicada
function dual(lattice: BooleanLattice): BooleanLattice {
  return {
    Element: lattice.Element,

    join: lattice.meet,
    meet: lattice.join,

    complement: lattice.complement,

    bottom: lattice.top,
    top: lattice.bottom,

    join_is_commutative: lattice.meet_is_commutative,
    meet_is_commutative: lattice.join_is_commutative,

    bottom_is_identity_of_join: lattice.top_is_identity_of_meet,
    top_is_identity_of_meet: lattice.bottom_is_identity_of_join,

    join_can_distribute_over_meet: lattice.meet_can_distribute_over_join,
    meet_can_distribute_over_join: lattice.join_can_distribute_over_meet,

    complement_join_for_top: lattice.complement_meet_for_bottom,
    complement_meet_for_bottom: lattice.complement_join_for_top,
  }
}
```

The `dual` of `BooleanLattice` is [involutive](<https://en.wikipedia.org/wiki/Involution_(mathematics)>).

```cicada
function dual_is_involutive(lattice: BooleanLattice): Equal(
  BooleanLattice,
  lattice,
  dual(dual(lattice)),
) {
  return refl
}
```

# Unique identity

```cicada
import { equal_swap, equal_compose } from "../equality/equal-utilities.md"
```

```cicada
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

  check lattice.join_is_commutative(lattice.bottom, o): Equal(
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
        lattice.join_is_commutative(lattice.bottom, o),
        lattice.bottom_is_identity_of_join(o)),
    )
  )
}
```

```cicada wishful-thinking
function join_unique_identity(
  lattice: BooleanLattice,
  o: lattice.Element,
  o_is_identity_of_join: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.join(x, o),
    x,
  ),
): Equal(lattice.Element, o, lattice.bottom) {
  return equal_rewrite (lattice.Element) {
    lattice.bottom
    by equal_swap(o_is_identity_of_join(lattice.bottom))
    lattice.join(lattice.bottom, o)
    by lattice.join_is_commutative(lattice.bottom, o)
    lattice.join(o, lattice.bottom)
    by lattice.bottom_is_identity_of_join(o)
    o
  }
}
```

```cicada
function meet_unique_identity(
  lattice: BooleanLattice,
  i: lattice.Element,
  i_is_identity_of_meet: (x: lattice.Element) -> Equal(
    lattice.Element,
    lattice.meet(x, i),
    x,
  ),
): Equal(lattice.Element, i, lattice.top) {
  return join_unique_identity(
    dual(lattice),
    i,
    i_is_identity_of_meet,
  )
}
```

# Idempotence

<https://en.wikipedia.org/wiki/Idempotence>

```cicada
import { equal_map } from "../equality/equal-utilities.md"
```

```cicada
function join_is_idempotent(
  lattice: BooleanLattice,
  x: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, x),
  x,
) {
  check equal_swap(lattice.top_is_identity_of_meet(lattice.join(x, x))): Equal(
    lattice.Element,
    lattice.join(x, x),
    lattice.meet(lattice.join(x, x), lattice.top),
  )

  check equal_swap(lattice.complement_join_for_top(x)): Equal(
    lattice.Element,
    lattice.top,
    lattice.join(x, lattice.complement(x)),
  )

  check equal_map(
    equal_swap(lattice.complement_join_for_top(x)),
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.meet(lattice.join(x, x), z),
    ),
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, x), lattice.top),
    lattice.meet(lattice.join(x, x), lattice.join(x, lattice.complement(x))),
  )

  check equal_swap(lattice.join_can_distribute_over_meet(x, x, lattice.complement(x))): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, x), lattice.join(x, lattice.complement(x))),
    lattice.join(x, lattice.meet(x, lattice.complement(x))),
  )

  check lattice.complement_meet_for_bottom(x): Equal(
    lattice.Element,
    lattice.meet(x, lattice.complement(x)),
    lattice.bottom,
  )

  check equal_map(
    lattice.complement_meet_for_bottom(x),
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(x, z),
    )
  ): Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(x, lattice.complement(x))),
    lattice.join(x, lattice.bottom),
  )

  check lattice.bottom_is_identity_of_join(x): Equal(
    lattice.Element,
    lattice.join(x, lattice.bottom),
    x,
  )

  return equal_compose(
    equal_swap(lattice.top_is_identity_of_meet(lattice.join(x, x))),
    equal_compose(
      equal_map(
        equal_swap(lattice.complement_join_for_top(x)),
        the(
          (lattice.Element) -> lattice.Element,
          (z) => lattice.meet(lattice.join(x, x), z),
        ),
      ),
      equal_compose(
        equal_swap(lattice.join_can_distribute_over_meet(x, x, lattice.complement(x))),
        equal_compose(
          equal_map(
            lattice.complement_meet_for_bottom(x),
            the(
              (lattice.Element) -> lattice.Element,
              (z) => lattice.join(x, z),
            )
          ),
          lattice.bottom_is_identity_of_join(x)
        )
      )
    )
  )
}
```

```cicada
function meet_is_idempotent(
  lattice: BooleanLattice,
  x: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, x),
  x,
) {
  return join_is_idempotent(dual(lattice), x)
}
```

# Order relation

We can define order relation by lattice operations.

```cicada
function Under(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Type {
  return Equal(
    lattice.Element,
    lattice.join(x, y),
    y,
  )
}
```

```cicada
function Above(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Type {
  return Under(dual(lattice), x, y)
}
```

TODO `Above` is the swap of `Under`

TODO `Under` is the swap of `Above`

# Boundaries

<https://en.wikipedia.org/wiki/Bounded_lattice>

```cicada
function top_is_at_the_top(
  lattice: BooleanLattice,
  x: lattice.Element,
): Under(lattice, x, lattice.top) {
  check refl: Equal(
    Type,
    Under(lattice, x, lattice.top),
    Equal(
      lattice.Element,
      lattice.join(x, lattice.top),
      lattice.top,
    )
  )

  check equal_swap(lattice.top_is_identity_of_meet(lattice.join(x, lattice.top))): Equal(
    lattice.Element,
    lattice.join(x, lattice.top),
    lattice.meet(lattice.join(x, lattice.top), lattice.top),
  )

  check lattice.meet_is_commutative(lattice.join(x, lattice.top), lattice.top): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, lattice.top), lattice.top),
    lattice.meet(lattice.top, lattice.join(x, lattice.top)),
  )

  check equal_map(
    equal_swap(lattice.complement_join_for_top(x)),
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.meet(z, lattice.join(x, lattice.top)),
    )
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.top, lattice.join(x, lattice.top)),
    lattice.meet(lattice.join(x, lattice.complement(x)), lattice.join(x, lattice.top)),
  )

  check equal_swap(
    lattice.join_can_distribute_over_meet(x, lattice.complement(x), lattice.top)
  ): Equal(
    lattice.Element,
    lattice.meet(lattice.join(x, lattice.complement(x)), lattice.join(x, lattice.top)),
    lattice.join(x, lattice.meet(lattice.complement(x), lattice.top)),
  )

  check equal_map(
    lattice.top_is_identity_of_meet(lattice.complement(x)),
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(x, z),
    ),
  ): Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(lattice.complement(x), lattice.top)),
    lattice.join(x, lattice.complement(x)),
  )

  check lattice.complement_join_for_top(x): Equal(
    lattice.Element,
    lattice.join(x, lattice.complement(x)),
    lattice.top,
  )

  return equal_compose(
    equal_swap(lattice.top_is_identity_of_meet(lattice.join(x, lattice.top))),
    equal_compose(
      lattice.meet_is_commutative(lattice.join(x, lattice.top), lattice.top),
      equal_compose(
        equal_map(
          equal_swap(lattice.complement_join_for_top(x)),
          the(
            (lattice.Element) -> lattice.Element,
            (z) => lattice.meet(z, lattice.join(x, lattice.top)),
          )
        ),
        equal_compose(
          equal_swap(
            lattice.join_can_distribute_over_meet(x, lattice.complement(x), lattice.top)
          ),
          equal_compose(
            equal_map(
              lattice.top_is_identity_of_meet(lattice.complement(x)),
              the(
                (lattice.Element) -> lattice.Element,
                (z) => lattice.join(x, z),
              ),
            ),
            lattice.complement_join_for_top(x),
          )
        )
      )
    )
  )
}
```

```cicada
function bottom_is_at_the_bottom(
  lattice: BooleanLattice,
  x: lattice.Element,
): Above(lattice, x, lattice.bottom) {
  return top_is_at_the_top(dual(lattice), x)
}
```

# Absorption law

<https://en.wikipedia.org/wiki/Absorption_law>

<https://en.wikipedia.org/wiki/Absorption_(logic)>

The terminology, which might be introduced by Russell and Whitehead, is very confusing.

```cicada
function join_absorb_over_meet(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.join(x, lattice.meet(x, y)),
  x,
) {
  let eq1: Equal(
    lattice.Element,
    lattice.join(x, lattice.meet(x, y)),
    lattice.join(lattice.meet(x, lattice.top), lattice.meet(x, y)),
  ) = equal_map(
    equal_swap(lattice.top_is_identity_of_meet(x)),
    the(
      (lattice.Element) -> lattice.Element,
      (z) => lattice.join(z, lattice.meet(x, y)),
    )
  )

  let eq2: Equal(
    lattice.Element,
    lattice.join(lattice.meet(x, lattice.top), lattice.meet(x, y)),
    lattice.meet(x, lattice.join(lattice.top, y)),
  ) = equal_swap(lattice.meet_can_distribute_over_join(x, lattice.top, y))

  let eq3: Equal(
    lattice.Element,
    lattice.meet(x, lattice.join(lattice.top, y)),
    lattice.meet(x, lattice.join(y, lattice.top)),
  ) = equal_map(
    lattice.join_is_commutative(lattice.top, y),
    the((lattice.Element) -> lattice.Element, (z) => lattice.meet(x, z)),
  )

  let eq4: Equal(
    lattice.Element,
    lattice.meet(x, lattice.join(y, lattice.top)),
    lattice.meet(x, lattice.top),
  ) = equal_map(
    top_is_at_the_top(lattice, y),
    the((lattice.Element) -> lattice.Element, (z) => lattice.meet(x, z)),
  )

  let eq5: Equal(
    lattice.Element,
    lattice.meet(x, lattice.top),
    x,
  ) = lattice.top_is_identity_of_meet(x)

  return equal_compose(
    eq1,
    equal_compose(
      eq2,
      equal_compose(
        eq3,
        equal_compose(
          eq4,
          eq5,
        )
      )
    )
  )
}
```

```cicada
function meet_absorb_over_join(
  lattice: BooleanLattice,
  x: lattice.Element,
  y: lattice.Element,
): Equal(
  lattice.Element,
  lattice.meet(x, lattice.join(x, y)),
  x,
) {
  return join_absorb_over_meet(dual(lattice), x, y)
}
```

# Associativity

```cicada
function join_is_associative(
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

function meet_is_associative(
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
```

# Two-element Boolean algebra

<https://en.wikipedia.org/wiki/Two-element_Boolean_algebra>

TODO

```cicada

```
