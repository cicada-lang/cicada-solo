---
title: Univalent Axiom
---

This is a formalization of the paper
["A self-contained, brief and complete formulation of Voevodsky’s Univalence Axiom"](https://homotopytypetheory.org/2018/03/07/a-self-contained-brief-and-complete-formulation-of-voevodskys-univalence-axiom)
by Martín Hötzel Escardó, October 18, 2018.

# Introduction

> Univalence axiom is not true or false,
> it is a property of Martin-Löf's identity type of a universe of types.

We can create models of the identity type in these theories,
which will make univalence axiom hold or fail.

# The identity type

The idea is that `Id(X, x, y)` collects the ways
in which `x` and `y` are identified.

```cicada
datatype Id(X: Type) (from: X, to: X) {
  refl(vague x: X): Id(X, x, x)
}
```

The constructor `refl` identifies any element with itself.
Without univalence, `refl` is the only given way
to construct elements of the identity type.

```cicada
compute Id.refl
check Id.refl: Id(String, "a", "a")
```

The induction over the identity type
give rise to a function we call `id_ind`
(`J` in the paper).

```cicada
function id_ind(
  implicit X: Type,
  motive: (from: X, to: X, target: Id(X, from, to)) -> Type,
  base: (x: X) -> motive(x, x, Id.refl),
  implicit x: X,
  implicit y: X,
  p: Id(X, x, y)
): motive(x, y, p) {
  return induction (p) {
    motive (from, to, target) => motive(from, to, target)
    case refl(vague z) => base(z)
  }
}
```

- **Xie**: Is it possible to implement `replace` by `id_ind` (or induction of `Id`)?

```cicada error
function replace(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Id(X, from, to),
  motive: (X) -> Type,
  base: motive(from),
): motive(to) {
  return induction (target) {
    motive (from, to, target) => motive(to)
    case refl => base
    // I infer the type to be:
    //   motive(from)
    // But the expected type is:
    //   motive(x)
    motive (_from, _to, target) => motive(to)
    case refl => base
    // I infer the type to be:
    //   motive(from)
    // But the expected type is:
    //   motive(to)
  }
}
```

- **Xie**: It seems there are many ways to define `id_ind`.

```cicada todo
function replace_with_id(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Id(X, from, to),
  motive: (x: X, id: Id(X, from, x)) -> Type,
  base: motive(from, Id.refl),
): motive(to, target) {
  return TODO
}
```

- **Xie:** The following function shows our definition of `Id` is absurd.

```cicada
function id_absurd(
  implicit A: Type,
  implicit x: A,
  id: Id(A, x, x),
  implicit y: A,
): Id(A, x, y) {
  return recursion (id) {
    case refl => Id.refl
  }
}
```

```cicada
function id_swap(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  id: Id(A, x, y),
): Id(A, y, x) {
  return recursion (id) {
    case refl => Id.refl
  }
}
```

Then, in summary, the identity type is given by the data `Id`, `refl`, `id_ind`.
With this, the exact nature of the type `Id(X, x, y)` is fairly under-specified.
It is consistent that it is always a subsingleton in the sense that `K(X)` holds.

- **Subsingleton types**: types whose elements are all identified.

```cicada
function K(X: Type): Type {
  return forall (
    x: X, y: X,
    p: Id(X, x, y), q: Id(X, x, y),
  ) Id(Id(X, x, y), p, q)
}
```

The `K` axiom says that `K(X)` holds for every type `X`.

```cicada wishful-thinking
function K_axiom(X: Type): K(X) {
  return TODO
}
```

In univalent mathematics, a type `X` that satisfies `K(X)` is called a _set_.

```cicada
let Set = K
```

And with this terminology, the `K` axiom says that all types are sets.

On the other hand, the univalence axiom provides a means of
constructing elements of identity type other than `refl`,
at least for some types, and hence the univalence
axiom implies that some types are not sets.

(Then they will instead be 1-groupoids, or 2-groupoids, ... ,
or even ∞-groupoids, with such notions defined within MLTT
rather than via models, but we will not address this important
aspect of univalent mathematics here).

# Universes

- **Xie**: In cicada we have type in type.

```cicada
check Type: Type
```

- **Xie**: Thus we define a simple universe `U` to be `Type`.

TODO Define `Group` as is in the paper.

With univalence, `Group` itself will not be a set, but a 1-groupoid instead,
namely a type whose identity types are all sets.
Moreover, if `U` satisfies the univalence axiom, then for `A: Group, B: Group`,
the identity type `Id(Group, A, B)` can be shown to be in bijection
with the group isomorphisms of `A` and `B`.

# Univalence

Univalence is a property of the identity type `Id(U)` of a universe `U`.

- **Xie**: We will define univalence axiom for `Id(Type)`?

It takes a number of steps to define the univalence type.

We say that a type `X` is a singleton if we have an element `c: X`
with `Id(X, c, x)` for all `x: X`. In Curry-Howard logic, this is

```cicada
function Singleton(X: Type): Type {
  return exists (c: X) forall (x: X) Id(X, c, x)
}
```

For a function `f: (X) -> Y` and an element `y: Y`,
its fiber is the type of points `x: X`
that are mapped to (a point identified with) `y`:

```cicada
function Fiber(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
  y: Y,
): Type {
  return exists (x: X) Id(Y, f(x), y)
}
```

The function f is called an equivalence
if its fibers are all singletons:

```cicada
function Equivalence(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
): Type {
  return forall (y: Y) Singleton(Fiber(f, y))

  // return forall (y: Y)
  //   Singleton(exists (x: X) Id(Y, f(x), y))

  // let Z = exists (x: X) Id(Y, f(x), y)
  // return forall (y: Y) exists (c: Z)
  //   forall (z: Z) Id(Z, c, z)
}
```

- **Xie:** Is the following the normal definition of homotopy equivalence?

```cicada
function Isomorphism(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
  g: (Y) -> X,
): Type {
  return Pair(
    forall (x: X) Id(X, g(f(x)), x),
    forall (y: Y) Id(Y, f(g(y)), y),
  )
}

function Isomorphic(X: Type, Y: Type): Type {
  return exists (f: (X) -> Y, g: (Y) -> X)
    Isomorphism(f, g)
}

function retraction(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
  g: (Y) -> X,
  iso: Isomorphism(f, g)
): Equivalence(f) {
  return TODO
}

function section(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
  g: (Y) -> X,
  eq: Equivalence(f)
): Isomorphism(f, g) {
  return TODO
}
```

The type of equivalences from `X: Type` to `Y: Type` is

```cicada
function Equivalent(X: Type, Y: Type): Type {
  return exists (f: (X) -> Y) Equivalence(f)
}
```

- **Xie**: TODO Why homotopy equivalence can be define by singleton and fiber?

Given `x: X`, we have the singleton type
consisting of the elements `y: X` identified with `x`:

```cicada
function Point(implicit X: Type, c: X): Type {
  return exists (x: X) Id(X, x, c)
}
```

We also have the element `eta(x)` of this type:

```cicada
function eta(implicit X: Type, x: X): Point(x) {
  return cons(x, Id.refl)
}
```

We now need to prove that singleton types are singletons:

```cicada
function point_singleton(
  implicit X: Type, c: X,
): Singleton(Point(c)) {
  function motive(y: X, x: X, p: Id(X, y, x)): Type {
    return Id(Point(x), eta(x), cons(y, p))
  }

  function base(x: X): motive(x, x, Id.refl) {
    return Id.refl
  }

  function phi(y: X, x: X, p: Id(X, y, x)): Id(Point(x), eta(x), cons(y, p)) {
    return id_ind(motive, base, p)
  }

  // Notice the reversal of `y` and `x`.
  //   With this, we can in turn define a function:

  function g(x: X, s: Point(x)): Id(Point(x), eta(x), s) {
    return phi(car(s), x, cdr(s))
  }

  return cons(eta(c), g(c))
}
```

Now, for any type `X`, its identity function `id(X)`, defined by `id(x) = x`,
is an equivalence. This is because the `Fiber(id, x)` is simply the singleton type
defined above, which we proved to be a singleton.
We need to name this function:

```cicada
function id(X: Type, x: X): X {
  return x
}

function id_is_equivalence(X: Type): Equivalence(id(X)) {
  return (c) => point_singleton(c)
}
```

The identity function `id(X)` should not be confused with the identity type `Id(X)`.
Now we use `id_ind` a second time to define a function

```cicada
function id_to_equivalent(X: Type, Y: Type, p: Id(Type, X, Y)): Equivalent(X, Y) {
  function motive(X: Type, Y: Type, p: Id(Type, X, Y)): Type {
    return Equivalent(X, Y)
  }

  function base(X: Type): Equivalent(X, X) {
    return cons(id(X), id_is_equivalence(X))
  }

  return id_ind(motive, base, p)
}
```

Finally, we say that the universe `U` is univalent
if the map `id_to_equivalent(X, Y)` is itself an equivalence:

- **Xie**: `Type` is our only universe.

```cicada
let type_is_univalent = forall (X: Type, Y: Type) Equivalence(id_to_equivalent(X, Y))
```

The type `type_is_univalent` may or may not have an inhabitant.
The univalence axiom says that it does.
The `K` axiom implies that it doesn't.
Because both univalence and the `K` axiom are consistent,
it follows that univalence is undecided in MLTT.

## Notes

TODO
