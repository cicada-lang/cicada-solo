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
  ): cat.hom_set(object, x).Eq(f, morphism(x))
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
  ): cat.hom_set(x, object).Eq(f, morphism(x))
}
```

If a terminal object exists, it is unique up to unique isomorphism.

```cicada
import { Isomorphism } from "./category.md"

function terminal_object_isomorphism(
  cat: Category,
  x: Terminal(cat),
  y: Terminal(cat),
): Isomorphism(cat, x.object, y.object) {
  return {
    cat,
    dom: x.object,
    cod: y.object,
    morphism: y.morphism(x.object),
    inverse: x.morphism(y.object),

    inverse_left: cat.hom_set(x.object, x.object).transitive(
      x.morphism_unique(
        cat.compose(
          y.morphism(x.object),
          x.morphism(y.object),
        ),
      ),
      cat.hom_set(x.object, x.object).symmetric(
        x.morphism_unique(
          cat.id(x.object)
        )
      )
    ),

    inverse_right: cat.hom_set(y.object, y.object).transitive(
      y.morphism_unique(
        cat.compose(
          x.morphism(y.object),
          y.morphism(x.object),
        ),
      ),
      cat.hom_set(y.object, y.object).symmetric(
        y.morphism_unique(
          cat.id(y.object)
        )
      )
    ),
  }
}
```
