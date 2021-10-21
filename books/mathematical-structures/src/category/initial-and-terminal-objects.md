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
    x: cat.Object,
    f: cat.Morphism(object, x),
  ): Equal(cat.Morphism(object, x), f, morphism(x))
}
```

# Terminal

``` cicada
class Terminal {
  cat: Category

  object: cat.Object
  morphism(x: cat.Object): cat.Morphism(x, object)
  morphism_unique(
    x: cat.Object,
    f: cat.Morphism(x, object),
  ): Equal(cat.Morphism(x, object), f, morphism(x))
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

    inverse_left: @TODO "inverse_left"

    // Equal(
    // cat.Morphism(dom, dom),
    // cat.compose(dom, cod, dom)(morphism, inverse),
    // cat.id(dom))

    // TODO we need to compose the following two Equal

    // x_terminal.morphism_unique(
    //   x_terminal.object,
    //   cat.compose(
    //     x_terminal.object, y_terminal.object, x_terminal.object,
    //     y_terminal.morphism(x_terminal.object),
    //     x_terminal.morphism(y_terminal.object)))

    // x_terminal.morphism_unique(
    //   x_terminal.object,
    //   cat.id(x_terminal.object))

    // TODO we need good way to compose Equal
    //   no we should use equivalence relation to define `Category` instead of `Equal`
    //   meybe use `Set` as the name of equivalence relation,
    //     and use `hom_set` as the name of its instance

    // TODO we need to be able to define this as `morphism_unique_aux` in the class

    //   morphism_unique_aux(
    //     x_terminal: cat.Object,
    //     f: cat.Morphism(x_terminal, object),
    //     g: cat.Morphism(x_terminal, object),
    //   ): Equal(cat.Morphism(x_terminal, object), f, g)


    inverse_right: @TODO "inverse_right"

    //   : Equal(
    // cat.Morphism(cod, cod),
    // cat.compose(cod, dom, cod)(inverse, morphism),
    // cat.id(cod))
  }
}
```