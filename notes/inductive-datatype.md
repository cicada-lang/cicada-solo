---
title: Inductive datatype
---

# Intro

- What inductive datatypes we already have?
- How will they look like, if we write them as `datatype` definitions?
- Can we from a general abstraction from these examples?
- Can we from some hypotheses from these examples?

Instead of learning about how to implement inductive datatype from a book a paper,
take it as a mathematical research practice will be more fun.

Just like Alain Connes said about "mathematician's wake"?

See Euler, we will find that his mathematics is all about
the art of inductive reasoning and discovering pattern.

Remember that, to generate the eliminator `ind` from constructors,
is to generate `ind`s type, and the type can be read as [Mathematical induction][].

[Mathematical induction]: https://en.wikipedia.org/wiki/Mathematical_induction

- What about non strict positive recursions? How will them read like?

Also note that the informations provided to induction eliminator,
allow us to construct proofs of the motive for any element of the type.

# Examples

## Nat

``` cicada not-yet
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}
```

**Hypothesis: cases**

One case one callback, which take all constructor arguments.

``` cicada
ind_nat_t = (
  target: Nat,
  motive: (Nat) -> Type,
  case_zero: motive(zero),
  case_add1: (
    prev: Nat,
    almost_on_prev: motive(prev),
  ) -> motive(add1(prev)),
) -> motive(target)
```

Suppose we have `induction (motive) { ... }`.

``` cicada not-yet
induction (motive) {
  case zero => ...
  case add1(prev) (almost_on_prev) => ...
}
```

Maybe we should use curried version,
to emphasize the result of induction proof is of the form "forall".

``` cicada
curried_ind_nat_t = (
  motive: (Nat) -> Type,
  case_zero: motive(zero),
  case_add1: (
    prev: Nat,
    almost_on_prev: motive(prev),
  ) -> motive(add1(prev)),
) -> (target: Nat) -> motive(target)
```

## List

``` cicada not-yet
datatype List(E: Type) {
  nil: List(E)
  li(head: E, tail: List(E)): List(E)
}
```

**Hypothesis: almost**

One recursive occurrence of the defined type one almost for case,
whose type is the `motive` applied to the recursive occurrence parameter.

``` cicada
ind_list_t = (
  implicit { E: Type },
  target: List(E),
  motive: (List(E)) -> Type,
  case_nil: motive(nil),
  case_li: (
    head: E, tail: List(E),
    almost_on_tail: motive(tail),
  ) -> motive(li(head, tail)),
) -> motive(target)
```

``` cicada
curried_ind_list_t = (
  implicit { E: Type },
  motive: (List(E)) -> Type,
  case_nil: motive(nil),
  case_li: (
    head: E, tail: List(E),
    almost_on_tail: motive(tail),
  ) -> motive(li(head, tail)),
) -> (target: List(E)) -> motive(target)
```

``` cicada not-yet
induction (motive) {
  case nil => ...
  case li(head, tail) (almost_on_tail) => ...
}
```

## Vector

``` cicada not-yet
datatype Vector(E: Type, length: Nat) {
  vecnil: Vector(E, zero)
  vec(head: E, tail: Vector(E, prev)): Vector(E, zero)
}
```

These new inductive datatypes might have both *parameters*,
which do not vary between the constructors,
and *indices*, which can vary between them.

In the definition of `Vector`, `E` is a parameter, `length` is an index.

**Hypothesis: motive**

The `motive` does not take parameter, but take index.

**Problem: indices in case argument**

Should we make the indices implicit?

- I think we should make indices implicit,
  because we tried this version of `our_vector_ind` in the little book,
  it works, and it simplifies the proofs.

``` cicada
vector_ind_t: Type = (
  implicit { E: Type, length: Nat },
  target: Vector(E, length),
  motive: (
    length: Nat,
    target: Vector(E, length),
  ) -> Type,
  case_vecnil: motive(0, vecnil),
  case_vec: (
    head: E,
    implicit { prev: Nat },
    tail: Vector(E, prev),
    almost_on_tail: motive(prev, tail),
  ) -> motive(add1(prev), vec(head, tail)),
) -> motive(length, target)
```

**Hypothesis: implicit parameters and indices**

In the curried version,
we can write implicit parameters over `motive`,
and implicit indices over `target`.

``` cicada
curried_vector_ind_t: Type = (
  // NOTE parameters
  implicit { E: Type },
  motive: (
    length: Nat,
    target: Vector(E, length),
  ) -> Type,
  case_vecnil: motive(0, vecnil),
  case_vec: (
    head: E,
    implicit { prev: Nat },
    tail: Vector(E, prev),
    almost_on_tail: motive(prev, tail),
  ) -> motive(add1(prev), vec(head, tail)),
) -> (
  // NOTE indices
  implicit { length: Nat },
  target: Vector(E, length),
) -> motive(length, target)
```

## Either

``` cicada not-yet
datatype Either(L, R) {
  inl(left: L): Either(L, R)
  inr(right: R): Either(L, R)
}
```

``` cicada
either_ind_t = (
  implicit { L: Type, R: Type },
  target: Either(L, R),
  motive: (Either(L, R)) -> Type,
  case_inl: (left: L) -> motive(inl(left)),
  case_inr: (right: R) -> motive(inr(right)),
) -> motive(target)
```

``` cicada
curried_either_ind_t = (
  implicit { L: Type, R: Type },
  motive: (Either(L, R)) -> Type,
  case_inl: (left: L) -> motive(inl(left)),
  case_inr: (right: R) -> motive(inr(right)),
) -> (target: Either(L, R)) -> motive(target)
```

``` cicada not-yet
induction (motive) {
  case inl(left) => ...
  case inr(right) => ...
}
```

## LessThan

``` cicada not-yet
datatype LessThan(j: Nat, k: Nat) {
  zero_smallest: (n: Nat) -> LessThan(zero, add1(n))
  add1_smaller: (
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ) -> LessThan(add1(j), add1(k))
}
```

We can not define `LessThan` as a datatype yet,
let's prepare some partial definitions:

``` cicada
LessThan(j: Nat, k: Nat): Type {
  @TODO "LessThan"
}

zero_smallest(n: Nat): LessThan(zero, add1(n)) {
  @TODO "zero_smallest"
}

add1_smaller(
  j: Nat, k: Nat,
  prev_smaller: LessThan(j, k),
): LessThan(add1(j), add1(k)) {
  @TODO "add1_smaller"
}
```

Then we can define `ind_less_than_t`:

``` cicada
ind_less_than_t = (
  implicit { j: Nat, k: Nat },
  target: LessThan(j, k),
  motive: (j: Nat, k: Nat, LessThan(j, k)) -> Type,
  case_zero_smallest: (n: Nat) -> motive(zero, add1(n), zero_smallest(n)),
  case_add1_smallest: (
    j: Nat, k: Nat, prev_smaller: LessThan(j, k),
    almost_on_prev_smaller: motive(j, k, prev_smaller),
  ) -> motive(add1(j), add1(k), add1_smaller(j, k, prev_smaller)),
) -> motive(j, k, target)
```

``` cicada
curried_ind_less_than_t = (
  motive: (j: Nat, k: Nat, LessThan(j, k)) -> Type,
  case_zero_smallest: (n: Nat) -> motive(zero, add1(n), zero_smallest(n)),
  case_add1_smallest: (
    j: Nat, k: Nat, prev_smaller: LessThan(j, k),
    almost_on_prev_smaller: motive(j, k, prev_smaller),
  ) -> motive(add1(j), add1(k), add1_smaller(j, k, prev_smaller)),
) -> (
  implicit { j: Nat, k: Nat },
  target: LessThan(j, k),
) -> motive(j, k, target)
```

``` cicada not-yet
induction (motive) {
  case zero_smallest(n) => ...
  case add1_smaller(j, k, prev_smaller) (almost_on_prev_smaller) => ...
}
```

# Well-founded relation and Noetherian induction

It seems a generalization of structural induction is Noetherian induction,
which depends on the concept of [Well-founded relation][].

[Well-founded relation]: https://en.wikipedia.org/wiki/Well-founded_relation

Preparing some partial definitions:

``` cicada
Not(X: Type): Type {
  (X) -> Absurd
}

NonEmptySubset(X: Type): Type {
  @TODO "NonEmptySubset"
}
```

Even with the preparation above,
we still can not yet define `WellFounded`,
because even if we define `NonEmptySubset`,
and say `S: NonEmptySubset(X)`,
we can not use `S` as a `Type`.

But let's move forward anyways, and use `<:` to denotes non-empty subset.

``` cicada not-yet
class WellFounded {
  X: Type
  R(X, X): Type
  minimal(S <: X): S
  minimality(S <: X): (s: S) -> Not(R(s, minimal))
}
```

When `R` is "less than",
`R(s, m)` reads "s less than m",
and `(R(s, m)) -> Absurd` reads:

- `s` not less than `m`
- `s` greater than or equal to `m`
- `m` less than or equal to `s`
- `m` is the minimal element of `S`

If minimal element exists,
there is no infinite sequence `x0, x1, x2, ...` of elements of `X`,
such that `x0 > x1 > x2 > ...`

# The duality between intro and elim rules and Adjoint functor

How to view the duality between intro and elim rules as a special case of adjoint functor?

TODO
