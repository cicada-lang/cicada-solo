---
title: Category Theory
author: Xie Yuheng
date: 2021-10-20
---

# Introduction

> Category theory formalizes mathematical structure and its concepts in
> terms of a labeled directed graph called a category, whose nodes are
> called objects, and whose labelled directed edges are called arrows
> (or morphisms). A category has two basic properties: the ability to
> compose the arrows associatively, and the existence of an identity
> arrow for each object.
>
> -- [Wikipedia / Category Theory](https://en.wikipedia.org/wiki/Category_theory)

# Category

``` cicada
class Category {
  Object: Type
  Morphism(dom: Object, cod: Object): Type
  id(x: Object): Morphism(x, x)

  compose(
    x: Object,
    y: Object,
    z: Object,
    f: Morphism(x, y),
    g: Morphism(y, z),
  ): Morphism(x, z)

  id_left(
    x: Object,
    y: Object,
    f: Morphism(x, y)
  ): Equal(Morphism(x, y), compose(x, x, y)(id(x), f), f)

  id_right(
    x: Object,
    y: Object,
    f: Morphism(x, y),
  ): Equal(Morphism(x, y), compose(x, y, y)(f, id(y)), f)

  compose_associative(
    x: Object,
    y: Object,
    z: Object,
    w: Object,
    f: Morphism(x, y),
    g: Morphism(y, z),
    h: Morphism(z, w),
  ): Equal(
    Morphism(x, w),
    compose(x, y, w)(f, compose(y, z, w)(g, h)),
    compose(x, z, w)(compose(x, y, z)(f, g), h))
}
```

## A trivial category

``` cicada
trivial_category: Category = {
  Object: Trivial
  Morphism: (dom, cod) => Trivial

  id: (x) => sole
  compose: (x, y, z, f, g) => sole
  id_left: (x, y, f) => refl
  id_right: (x, y, f) => refl

  compose_associative: (x, y, z, w, f, g, h) => refl
}
```

# Functor

``` cicada
class Functor {
  dom: Category
  cod: Category
  map(x: dom.Object): cod.Object

  fmap(
    x: dom.Object,
    y: dom.Object,
    f: dom.Morphism(x, y)
  ): cod.Morphism(map(x), map(y))

  fmap_respect_compose(
    x: dom.Object,
    y: dom.Object,
    z: dom.Object,
    f: dom.Morphism(x, y),
    g: dom.Morphism(y, z),
  ): Equal(
    cod.Morphism(map(x), map(z)),
    fmap(x, z)(dom.compose(x, y, z)(f, g)),
    cod.compose(
      map(x), map(y), map(z),
      fmap(x, y)(f),
      fmap(y, z)(g)
    )
  )

  fmap_respect_id(
    x: dom.Object
  ): Equal(
    cod.Morphism(map(x), map(x)),
    fmap(x, x)(dom.id(x)),
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
    x: dom.Object,
    y: dom.Object,
    f: dom.Morphism(x, y),
  ): Equal(
    cod.Morphism(src.map(x), tar.map(y)),
    cod.compose(
      src.map(x), tar.map(x), tar.map(y),
      component(x), tar.fmap(x, y)(f)
    ),
    cod.compose(
      src.map(x), src.map(y), tar.map(y),
      src.fmap(x, y)(f), component(y)
    )
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
    x: cat.Object,
    f: cat.Morphism(cod, x),
    g: cat.Morphism(cod, x),
    Equal(
      cat.Morphism(dom, x),
      cat.compose(dom, cod, x)(morphism, f),
      cat.compose(dom, cod, x)(morphism, g)),
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
    x: cat.Object,
    f: cat.Morphism(x, dom),
    g: cat.Morphism(x, dom),
    Equal(
      cat.Morphism(x, cod),
      cat.compose(x, dom, cod)(f, morphism),
      cat.compose(x, dom, cod)(g, morphism)),
  ): Equal(cat.Morphism(x, dom), f, g)
}

// NOTE example:
//   mono: Monomorphism(cat, x, y)
//   mono.morphism: mono.cat.Morphism(x, y)
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
    cat.compose(dom, cod, dom)(morphism, inverse),
    cat.id(dom))

  inverse_right: Equal(
    cat.Morphism(cod, cod),
    cat.compose(cod, dom, cod)(inverse, morphism),
    cat.id(cod))
}
```
