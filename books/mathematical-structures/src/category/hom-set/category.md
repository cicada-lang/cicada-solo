---
title: Category Theory (hom-set version)
author: Xie Yuheng
date: 2021-10-20
---

# Set

``` cicada
class Set {
  Element: Type
  Eqv(Element, Element): Type

  reflexive(x: Element): Eqv(x, x)

  transitive(
    implicit { x: Element, y: Element },
    Eqv(x, y),
    implicit { z: Element },
    Eqv(y, z),
  ): Eqv(x, z)

  symmetric(
    implicit { x: Element, y: Element },
    Eqv(x, y),
  ): Eqv(y, x)
}
```

# Category

``` cicada
class Category {
  Object: Type
  Morphism(dom: Object, cod: Object): Type
  id(x: Object): Morphism(x, x)

  hom_set(x: Object, y: Object): Set(Morphism(x, y))

  compose(
    implicit { x: Object, y: Object },
    f: Morphism(x, y),
    implicit { z: Object },
    g: Morphism(y, z),
  ): Morphism(x, z)

  id_left(
    implicit { x: Object, y: Object },
    f: Morphism(x, y)
  ): hom_set(x, y).Eqv(compose(id(x), f), f)

  id_right(
    implicit { x: Object, y: Object },
    f: Morphism(x, y),
  ): hom_set(x, y).Eqv(compose(f, id(y)), f)

  compose_associative(
    implicit { x: Object, y: Object },
    f: Morphism(x, y),
    implicit { z: Object },
    g: Morphism(y, z),
    implicit { w: Object },
    h: Morphism(z, w),
  ): hom_set(x, w).Eqv(
    compose(f, compose(g, h)),
    compose(compose(f, g), h)
  )
}
```

## A trivial category

``` cicada
trivial_category: Category = {
  Object: Trivial
  Morphism: (dom, cod) => Trivial

  hom_set: (x, y) => @TODO "hom_set"

  id: (x) => sole

  compose: (f, g) => sole
  id_left: (f) => @TODO "id_left"
  id_right: (f) => @TODO "id_right"

  compose_associative: (f, g, h) => @TODO "compose_associative"
}
```

# Functor

``` cicada
class Functor {
  dom: Category
  cod: Category
  map(x: dom.Object): cod.Object

  fmap(
    implicit { x: dom.Object, y: dom.Object },
    f: dom.Morphism(x, y)
  ): cod.Morphism(map(x), map(y))

  fmap_respect_compose(
    implicit { x: dom.Object, y: dom.Object },
    f: dom.Morphism(x, y),
    implicit { z: dom.Object },
    g: dom.Morphism(y, z),
  ): Equal(
    cod.Morphism(map(x), map(z)),
    fmap(dom.compose(f, g)),
    cod.compose(fmap(f), fmap(g))
  )

  fmap_respect_id(
    x: dom.Object
  ): Equal(
    cod.Morphism(map(x), map(x)),
    fmap(dom.id(x)),
    cod.id(map(x)))
}
```

# NaturalTransformation

``` cicada
class NaturalTransformation {
  dom: Category
  cod: Category

  // NOTE The following use of `Functor(dom, cod)`
  //  is an example of fulfilling type.
  src: Functor(dom, cod)
  tar: Functor(dom, cod)

  component(x: dom.Object): cod.Morphism(src.map(x), tar.map(x))

  naturality(
    implicit { x: dom.Object, y: dom.Object },
    f: dom.Morphism(x, y),
  ): Equal(
    cod.Morphism(src.map(x), tar.map(y)),
    cod.compose(component(x), tar.fmap(f)),
    cod.compose(src.fmap(f), component(y))
  )
}
```

# Epimorphism

``` cicada
class Epimorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)

  cancel_left(
    implicit {
      x: cat.Object,
      f: cat.Morphism(cod, x),
      g: cat.Morphism(cod, x),
    },
    Equal(
      cat.Morphism(dom, x),
      cat.compose(morphism, f),
      cat.compose(morphism, g)),
  ): Equal(cat.Morphism(cod, x), f, g)
}
```

# Monomorphism

``` cicada
class Monomorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)

  cancel_right(
    implicit {
      x: cat.Object,
      f: cat.Morphism(x, dom),
      g: cat.Morphism(x, dom),
    },
    Equal(
      cat.Morphism(x, cod),
      cat.compose(f, morphism),
      cat.compose(g, morphism)),
  ): Equal(cat.Morphism(x, dom), f, g)
}
```

# Isomorphism

``` cicada
class Isomorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)
  inverse: cat.Morphism(cod, dom)

  inverse_left: Equal(
    cat.Morphism(dom, dom),
    cat.compose(morphism, inverse),
    cat.id(dom))

  inverse_right: Equal(
    cat.Morphism(cod, cod),
    cat.compose(inverse, morphism),
    cat.id(cod))
}
```
