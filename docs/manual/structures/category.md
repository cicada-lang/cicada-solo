---
title: Category Theory
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

To each species of mathematical structure,
there corresponds a category whose objects have that structure,
and whose morphisms respect [preserve] it.

```cicada
class Category {
  Object: Type

  Morphism(dom: Object, cod: Object): Type

  id(x: Object): Morphism(x, x)

  compose(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
    implicit z: Object,
    g: Morphism(y, z),
  ): Morphism(x, z)

  id_left(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y)
  ): Equal(Morphism(x, y), compose(id(x), f), f)

  id_right(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
  ): Equal(Morphism(x, y), compose(f, id(y)), f)

  compose_associative(
    implicit x: Object,
    implicit y: Object,
    f: Morphism(x, y),
    implicit z: Object,
    g: Morphism(y, z),
    implicit w: Object,
    h: Morphism(z, w),
  ): Equal(
    Morphism(x, w),
    compose(f, compose(g, h)),
    compose(compose(f, g), h)
  )
}
```

## A trivial category

```cicada
let trivial_category: Category = {
  Object: Trivial,
  Morphism: (dom, cod) => Trivial,

  hom_set(x, y) {
    return {
      Element: Trivial,
      Eq: (x, y) => Equal(Trivial, x, y),
      reflexive: (x) => refl,
      transitive: (x_eq_y, y_eq_z) => refl,
      symmetric: (x_eq_y) => refl,
    }
  },

  id: (x) => sole,

  compose: (f, g) => sole,
  id_left: (f) => refl,
  id_right: (f) => refl,

  compose_associative: (f, g, h) => refl,
}
```

# Functor

To any natural construction on structures of one species,
yielding structures of another species,
there corresponds a functor
from the category of the first species
to the category of the second.

For example, in the category of types in a programming language,
type constructors are endo-functors,
and endo-functors are often containers.

Functor can also be called natural-construction,
which will let the term `NaturalTransformation` make sense.

```cicada
class Functor {
  dom: Category
  cod: Category
  map(x: dom.Object): cod.Object

  fmap(
    implicit x: dom.Object,
    implicit y: dom.Object,
    f: dom.Morphism(x, y)
  ): cod.Morphism(map(x), map(y))

  fmap_respect_compose(
    implicit x: dom.Object,
    implicit y: dom.Object,
    f: dom.Morphism(x, y),
    implicit z: dom.Object,
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

To each natural translation,
from a construction `F : A -> B`,
to a construction `G : A -> B`,
there corresponds a natural transformation `F => G`.

This captures the concept of "natural translation".

The naturality condition of natural-transformation
state squares commute.

Which can be viewed as stating that
the arrows in the two embeddings
are "orthogonal" to the transforming arrows.

This concept was the historical origin of category theory,
since Eilenberg and MacLane (1945) used it to formalise
the notion of an equivalence of homology theories,

and then found that for this definition to make sense,
they had to define functors,

(A homology theory is a functor.)

and for functors to make sense,
they had to define categories.

(A homology theory is a functor,
from the category of topology spaces
to the category of abelian-groups.)

```cicada
class NaturalTransformation {
  dom: Category
  cod: Category

  // NOTE The following use of `Functor(dom, cod)`
  //  is an example of fulfilling type.
  src: Functor(dom, cod)
  tar: Functor(dom, cod)

  component(x: dom.Object): cod.Morphism(src.map(x), tar.map(x))

  naturality(
    implicit x: dom.Object,
    implicit y: dom.Object,
    f: dom.Morphism(x, y),
  ): Equal(
    cod.Morphism(src.map(x), tar.map(y)),
    cod.compose(component(x), tar.fmap(f)),
    cod.compose(src.fmap(f), component(y))
  )
}
```

# Epimorphism

```cicada
class Epimorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)

  cancel_left(
    implicit x: cat.Object,
    implicit f: cat.Morphism(cod, x),
    implicit g: cat.Morphism(cod, x),
    Equal(
      cat.Morphism(dom, x),
      cat.compose(morphism, f),
      cat.compose(morphism, g)),
  ): Equal(cat.Morphism(cod, x), f, g)
}
```

# Monomorphism

```cicada
class Monomorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)

  cancel_right(
    implicit x: cat.Object,
    implicit f: cat.Morphism(x, dom),
    implicit g: cat.Morphism(x, dom),
    Equal(
      cat.Morphism(x, cod),
      cat.compose(f, morphism),
      cat.compose(g, morphism)),
  ): Equal(cat.Morphism(x, dom), f, g)
}

// NOTE example:
//   mono: Monomorphism(cat, x, y)
//   mono.morphism: mono.cat.Morphism(x, y)
```

# Isomorphism

Two objects have the same structure iff they are isomorphic,
and an "abstract object" is an isomorphism class of objects.

```cicada
class Isomorphism {
  cat: Category
  dom: cat.Object
  cod: cat.Object
  morphism: cat.Morphism(dom, cod)
  inverse: cat.Morphism(cod, dom)

  inverse_left: Equal(
    cat.Morphism(dom, dom),
    cat.compose(morphism, inverse),
    cat.id(dom)
  )

  inverse_right: Equal(
    cat.Morphism(cod, cod),
    cat.compose(inverse, morphism),
    cat.id(cod)
  )
}
```

# Limit

A diagram D in a category C can be seen as a system of constraints,
and then a limit of D represents all possible solutions of the system.

TODO

# Adjoint

To any canonical construction from one species of structure to another
corresponds an adjunction between the corresponding categories.

This captures the concept of "canonical construction".

TODO

# Colimit

TODO

# Comma category

Comma categories are another basic construction that
first appeared in lawvere's thesis.

They tend to arise when morphisms are used as objects.

TODO
