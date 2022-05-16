---
section: Structure
title: Groupoid Theory
---

# Dependencies

```cicada
import { Category, Isomorphism } from "./02-category.md"
```

# Groupoid

```cicada
class Groupoid extends Category {
  inv(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Morphism(y, x)

  // NOTE The following use of `Isomorphism`
  //   is an example of "partly fulfilled object construction".
  inv_iso(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Isomorphism(super, x, y, f, inv(f))
}
```

## A trivial groupoid

```cicada
import { trivial_category } from "./02-category.md"

let trivial_isomorphism_t = Isomorphism(trivial_category, sole, sole, sole, sole)

let trivial_isomorphism: trivial_isomorphism_t = {
  cat: trivial_category,

  dom: sole,
  cod: sole,
  morphism: sole,
  inverse: sole,

  inverse_left: refl,
  inverse_right: refl,
}

let trivial_groupoid: Groupoid = {
  ...trivial_category,

  inv: (f) => sole,
  inv_iso: (f) => trivial_isomorphism,
}
```
