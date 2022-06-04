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

The induction over the identity type give rise to a function we call `J`.

```cicada
function J(
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

- **Xie**: Is it possible to implement `replace` by `J` (or induction of `Id`)?

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

Then, in summary, the identity type is given by the data `Id`, `refl`, `J`.
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

```cicada
let U = Type
```

TODO Define `Grp` as is in the paper.

With univalence, `Grp` itself will not be a set, but a 1-groupoid instead,
namely a type whose identity types are all sets.
Moreover, if `U` satisfies the univalence axiom, then for `A, B : Grp`,
the identity type `Id(Grp, A, B)` can be shown to be in bijection
with the group isomorphisms of `A` and `B`.

# Univalence

Univalence is a property of the identity type `Id(U)` of a universe `U`.

- **Xie**: We will define univalence axiom for `Id(Type)`?

It takes a number of steps to define the univalence type.

We say that a type `X` is a singleton if we have an element `c: X`
with `Id(X, c, x)` for all `x: X`. In Curry-Howard logic, this is

```cicada
function singleton(X: Type): Type {
  return exists (c: X) forall (x: X) Id(X, c, x)
}
```

For a function `f: (X) -> Y` and an element `y: Y`,
its fiber is the type of points `x: X`
that are mapped to (a point identified with) `y`:

```cicada
function fiber(
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
function equivalence(
  implicit X: Type,
  implicit Y: Type,
  f: (X) -> Y,
): Type {
  return forall (y: Y) singleton(fiber(f, y))
}
```

The type of equivalences from `X: Type` to `Y: Type` is

```cicada
function Equivalent(X: Type, Y: Type): Type {
  return exists (f: (X) -> Y) equivalence(f)
}
```

- **Xie**: TODO Why homotopy equivalence can be define by singleton and fiber?

Given `x: X`, we have the singleton type
consisting of the elements `y: X` identified with `x`:

```cicada
function constant_space(implicit X: Type, c: X): Type {
  return exists (x: X) Id(X, x, c)
}
```

We also have the element `eta(x)` of this type:

```cicada
function eta(implicit X: Type, x: X): constant_space(x) {
  return cons(x, Id.refl)
}
```

We now need to prove that singleton types are singletons:

```cicada
function constant_space_is_singleton(
  implicit X: Type, c: X,
): singleton(constant_space(c)) {
  function motive(y: X, x: X, p: Id(X, y, x)): Type {
    return Id(constant_space(x), eta(x), cons(y, p))
  }

  function base(x: X): motive(x, x, Id.refl) {
    return Id.refl
  }

  function phi(y: X, x: X, p: Id(X, y, x)): Id(constant_space(x), eta(x), cons(y, p)) {
    return J(motive, base, p)
  }

  // Notice the reversal of `y` and `x`.
  //   With this, we can in turn define a function:

  function g(x: X, s: constant_space(x)): Id(constant_space(x), eta(x), s) {
    return phi(car(s), x, cdr(s))
  }

  return cons(eta(c), g(c))
}
```

Now, for any type `X`, its identity function `id(X)`, defined by `id(x) = x`,
is an equivalence. This is because the `fiber(id, x)` is simply the singleton type
defined above, which we proved to be a singleton.
We need to name this function:

```cicada
function id(X: Type, x: X): X {
  return x
}

function id_is_equivalence(X: Type): equivalence(id(X)) {
  return (c) => constant_space_is_singleton(c)
}
```

The identity function `id(X)` should not be confused with the identity type `Id(X)`.
Now we use `J` a second time to define a function

```cicada
function id_to_equivalent(X: Type, Y: Type, p: Id(Type, X, Y)): Equivalent(X, Y) {
  function motive(X: Type, Y: Type, p: Id(Type, X, Y)): Type {
    return Equivalent(X, Y)
  }

  function base(X: Type): Equivalent(X, X) {
    return cons(id(X), id_is_equivalence(X))
  }

  return J(motive, base, p)
}
```

Finally, we say that the universe `U` is univalent
if the map `id_to_equivalent(X, Y)` is itself an equivalence:

- **Xie**: `Type` is our only universe.

```cicada
let type_is_univalent = forall (X: Type, Y: Type) equivalence(id_to_equivalent(X, Y))
```

The type `type_is_univalent` may or may not have an inhabitant.
The univalence axiom says that it does.
The `K` axiom implies that it doesn't.
Because both univalence and the `K` axiom are consistent,
it follows that univalence is undecided in MLTT.

## Notes

TODO
