---
title: Initial and Terminal Objects
author: Xie Yuheng
date: 2021-10-20
---

# Dependences

``` cicada
import { Category } from "./category.md"
```

# Initial

``` cicada
class Initial {
  cat: Category

  object: cat.Object
  morphism(x: cat.Object): cat.Morphism(object, x)
  morphism_unique(
    implicit { x: cat.Object },
    f: cat.Morphism(object, x),
  ): cat.hom_set(object, x).Eq(f, morphism(x))
}
```

# Terminal

``` cicada
class Terminal {
  cat: Category

  object: cat.Object
  morphism(x: cat.Object): cat.Morphism(x, object)
  morphism_unique(
    implicit { x: cat.Object },
    f: cat.Morphism(x, object),
  ): cat.hom_set(x, object).Eq(f, morphism(x))
}
```

If a terminal object exists, it is unique up to unique isomorphism.

``` cicada
import { Isomorphism } from "./category.md"

terminal_object_isomorphism(
  cat: Category,
  x_terminal: Terminal(cat),
  y_terminal: Terminal(cat),
): Isomorphism(cat, x_terminal.object, y_terminal.object) {
  {
    cat
    dom: x_terminal.object
    cod: y_terminal.object
    morphism: y_terminal.morphism(x_terminal.object)
    inverse: x_terminal.morphism(y_terminal.object)

    inverse_left: cat.hom_set(x_terminal.object, x_terminal.object).transitive(
      x_terminal.morphism_unique(
        cat.compose(
          y_terminal.morphism(x_terminal.object),
          x_terminal.morphism(y_terminal.object),
        ),
      ),
      cat.hom_set(x_terminal.object, x_terminal.object).symmetric(
        x_terminal.morphism_unique(
          cat.id(x_terminal.object)
        )
      )
    )

    inverse_right: cat.hom_set(y_terminal.object, y_terminal.object).transitive(
      y_terminal.morphism_unique(
        cat.compose(
          x_terminal.morphism(y_terminal.object),
          y_terminal.morphism(x_terminal.object),
        ),
      ),
      cat.hom_set(y_terminal.object, y_terminal.object).symmetric(
        y_terminal.morphism_unique(
          cat.id(y_terminal.object)
        )
      )
    )
  }
}
```
