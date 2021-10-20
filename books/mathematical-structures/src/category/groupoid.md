---
title: Groupoid Theory
author: Xie Yuheng
date: 2021-10-20
---

# Dependences

``` cicada
import { Category, Isomorphism } from "./category.md"
```

# Groupoid

``` cicada
class Groupoid extends Category {
  inv(x: Object, y: Object, f: Morphism(x, y)): Morphism(y, x)

  // NOTE The following use of `Isomorphism`
  //   is an example of "partly fulfilled object construction".
  inv_iso(
    x: Object,
    y: Object,
    f: Morphism(x, y),
  ): Isomorphism(super, x, y, f, inv(x, y, f))
}
```

## A trivial groupoid

``` cicada
import { trivial_category } from "./category.md"

trivial_isomorphism_t = Isomorphism(trivial_category, sole, sole, sole, sole)

trivial_isomorphism: trivial_isomorphism_t = {
  cat: trivial_category

  dom: sole
  cod: sole
  morphism: sole
  inverse: sole

  inverse_left: refl
  inverse_right: refl
}

trivial_groupoid: Groupoid = {
  ...trivial_category

  inv: (x, y, f) => sole
  inv_iso: (x, y, f) => trivial_isomorphism
}
```
