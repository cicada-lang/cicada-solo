---
title: Initial and Terminal Objects
---

# Dependencies

```cicada
import { Category } from "./category.md"
```

# Initial

```cicada
class Initial {
  cat: Category

  object: cat.Object

  morphism(x: cat.Object): cat.Morphism(object, x)

  morphism_unique(
    implicit x: cat.Object,
    f: cat.Morphism(object, x),
  ): Equal(cat.Morphism(object, x), f, morphism(x))
}
```

# Terminal

```cicada
class Terminal {
  cat: Category

  object: cat.Object
  morphism(x: cat.Object): cat.Morphism(x, object)
  morphism_unique(
    implicit x: cat.Object,
    f: cat.Morphism(x, object),
  ): Equal(cat.Morphism(x, object), f, morphism(x))
}
```

# Terminal is an universal construction

If a terminal object exists, it is unique up to unique isomorphism.

<https://github.com/xieyuheng/cat/blob/master/src/category.agda>

```cicada
import { Isomorphism } from "./category.md"
import { equal_swap, equal_compose } from "../equality/equal-utilities.md"

function terminal_object_isomorphism(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
): Isomorphism(cat, x.object, y.object) {
  let f = x.morphism(y.object)
  let g = y.morphism(x.object)

  return {
    cat,
    dom: x.object,
    cod: y.object,
    morphism: y.morphism(x.object),
    inverse: x.morphism(y.object),

    inverse_left: equal_compose(
      x.morphism_unique(cat.compose(g, f)),
      equal_swap(x.morphism_unique(cat.id(x.object)))
    ),

    inverse_right: equal_compose(
      y.morphism_unique(cat.compose(f, g)),
      equal_swap(y.morphism_unique(cat.id(y.object)))
    ),
  }
}

function terminal_object_isomorphism_unique(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
  f: Isomorphism(cat, x.object, y.object),
  g: Isomorphism(cat, x.object, y.object),
): Equal(Isomorphism(cat, x.object, y.object), f, g) {
  return TODO
}
```
