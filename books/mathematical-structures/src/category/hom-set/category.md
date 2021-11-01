---
title: Category Theory (hom-set version)
author: Xie Yuheng
date: 2021-10-20
---

# Set

Bishop's set theory:

> A set is not an entity which has an ideal existence.
> A set exists only when it has been defined.
>
> To define a set we prescribe, at least implicitly,
> 1. what we (the constructing intelligence) must do
>    in order to construct an element of the set,
> 2. and what we must do to show that
>    two elements of the set are equal.
>
> Errett Bishop, A Constructivist Manifesto

``` cicada
class Set {
  Element: Type
  Eq(Element, Element): Type

  reflexive(x: Element): Eq(x, x)

  transitive(
    implicit { x: Element, y: Element },
    Eq(x, y),
    implicit { z: Element },
    Eq(y, z),
  ): Eq(x, z)

  symmetric(
    implicit { x: Element, y: Element },
    Eq(x, y),
  ): Eq(y, x)
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
  ): hom_set(x, y).Eq(compose(id(x), f), f)

  id_right(
    implicit { x: Object, y: Object },
    f: Morphism(x, y),
  ): hom_set(x, y).Eq(compose(f, id(y)), f)

  compose_associative(
    implicit { x: Object, y: Object },
    f: Morphism(x, y),
    implicit { z: Object },
    g: Morphism(y, z),
    implicit { w: Object },
    h: Morphism(z, w),
  ): hom_set(x, w).Eq(
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

  hom_set: (x, y) => {
    Element: Trivial
    Eq: (x, y) => Equal(Trivial, x, y)
    reflexive: (x) => refl
    transitive: (x_eq_y, y_eq_z) => refl
    symmetric: (x_eq_y) => refl
  }

  id: (x) => sole

  compose: (f, g) => sole
  id_left: (f) => refl
  id_right: (f) => refl

  compose_associative: (f, g, h) => refl
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
  ): cod.hom_set(map(x), map(z)).Eq(
    fmap(dom.compose(f, g)),
    cod.compose(fmap(f), fmap(g))
  )

  fmap_respect_id(
    x: dom.Object
  ): cod.hom_set(map(x), map(x)).Eq(
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
  ): cod.hom_set(src.map(x), tar.map(y)).Eq(
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
    cat.hom_set(dom, x).Eq(
      cat.compose(morphism, f),
      cat.compose(morphism, g)),
  ): cat.hom_set(cod, x).Eq(f, g)
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
    cat.hom_set(x, cod).Eq(
      cat.compose(f, morphism),
      cat.compose(g, morphism)),
  ): cat.hom_set(x, dom).Eq(f, g)
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

  inverse_left: cat.hom_set(dom, dom).Eq(
    cat.compose(morphism, inverse),
    cat.id(dom)
  )

  inverse_right: cat.hom_set(cod, cod).Eq(
    cat.compose(inverse, morphism),
    cat.id(cod)
  )
}
```
