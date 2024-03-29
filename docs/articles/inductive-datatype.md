---
title: Inductive datatype
author: Xie Yuheng
date: 2021-10-31
---

# Intro

- What inductive datatypes we already have?
- How will they look like, if we write them as `datatype` definitions?
- Can we from a general abstraction from these examples?
- Can we from some hypotheses from these examples?

Instead of learning about how to implement inductive datatype from a book or a paper,
taking it as a mathematical research practice might be more fun.

Just like Alain Connes said about "mathematician's wake"?

See Euler, we will find that his mathematics is all about
the art of inductive reasoning and discovering pattern.

# Understand the Problem

- We will generate `induction` eliminator from constructors of each datatype.

  The input include one _type constructor_ and many _data constructors_,
  the arguments of type constructor are splitted into two groups:
  _parameters_ that are the same for all constructors,
  and _indexes_ that vary from constructor to constructor.

  The output is the eliminator.

  to generate the eliminator is to specify its type,

  - infer application of eliminator.

  and be able to apply it to target.

  - evaluate application of eliminator.

  Condition of this problem includes:

  - We must be able to read the type of an eliminator as [Mathematical induction](https://en.wikipedia.org/wiki/Mathematical_induction).

    - What about non strict positive recursions? How will them read like?

  - The data provided to eliminator must be sufficient,
    allowing us to construct proofs of the motive for any element of the type.

- We will be able to check the application of data constructors.

  - The application of a data constructor should be checked instead of inferred.
  - A data constructor might have implement arguments that are solved during checking.

# Example inductive datatypes

## Nat

```cicada
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}
```

> **Hypothesis: cases**
>
> One case one callback, which take all constructor arguments.

```cicada
let curried_ind_nat_t = (
  motive: (Nat) -> Type,
  case_of_zero: motive(Nat.zero),
  case_of_add1: (
    prev: Nat,
    almost_of_prev: motive(prev),
  ) -> motive(Nat.add1(prev)),
) -> (target: Nat) -> motive(target)
```

Note that, if we make `target` the last argument,
we can emphasize the result of induction proof is of the form "for all".

But keeping the `target` the first argument will help implicit argument over `target`,
and make the syntax more familiar.
Because when we use induction to implement a function, the `target` is often in scope,
and when the `target` is in scope, the implicit arguments over it are often also in scope.

Thus we use the following type, instead of the type above.

```cicada
let ind_nat_t = (
  target: Nat,
  motive: (Nat) -> Type,
  case_of_zero: motive(Nat.zero),
  case_of_add1: (
    prev: Nat,
    almost_of_prev: motive(prev),
  ) -> motive(Nat.add1(prev)),
) -> motive(target)
```

Suppose we have the following syntax for applying induction:

```cicada wishful-thinking
induction (<target>) {
  motive (index, ..., target) => ...
  case <cons1>(<arg>, ...) => ...
  case <cons2>(<arg>, ...) => ...
  ...
}
```

Take `Nat` as an example, we have special syntax:

```cicada wishful-thinking
induction (target) {
  motive (n) => ...
  case zero => ...
  case add1(prev, almost) => ...
}
```

## List

```cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

> **Hypothesis: parameters**
>
> During the definition of a inductive type,
> the parameters are in scope,
> and the indexes are _not_ in scope.

> **Hypothesis: almost**
>
> One recursive occurrence of the defined type one almost for case,
> whose type is the `motive` applied to the recursive occurrence parameter.

```cicada
let ind_list_t = (
  implicit E: Type,
  target: List(E),
  motive: (List(E)) -> Type,
  case_of_null: motive(List.null),
  case_of_cons: (
    head: E, tail: List(E),
    almost_of_tail: motive(tail),
  ) -> motive(List.cons(head, tail)),
) -> motive(target)
```

```cicada wishful-thinking
induction (target) {
  motive (list) => ...
  case nil => ...
  case li(head, tail) (almost_of_tail) => ...
}
```

## Vector

```cicada
datatype Vector(E: Type) (length: Nat) {
  null: Vector(E, Nat.zero)
  cons(
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}
```

These new inductive datatypes might have both _parameters_,
which do not vary between the constructors,
and _indices_, which can vary between them.

In the definition of `Vector`, `E` is a parameter, `length` is an index.

> **Hypothesis: motive**
>
> The `motive` does not take parameter, but take index.

Why we should not make the indices in `motive` implicit?

TODO

> **Hypothesis: implicit parameters and indices**
>
> We should not write implicit parameters over `motive`,
> we should write implicit indices over `target`.

```cicada
let induction_vector_t = (
  implicit E: Type,
  implicit length: Nat,
  target: Vector(E, length),
  motive: (length: Nat, Vector(E, length)) -> Type,
  case_of_null: motive(Nat.zero, Vector.null),
  case_of_cons: (
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
    almost: class { tail: motive(prev, tail) },
  ) -> motive(Nat.add1(prev), Vector.cons(head, tail)),
) -> motive(length, target)
```

Why we can write implicit over `target`?

TODO

Why we can write implicit in cases' arguments?

TODO

```cicada wishful-thinking
induction (target) {
  motive (length, target) => ...
  case vecnil => ...
  case vec(head, tail) (almost_of_tail) => ...
}
```

## Either

```cicada
datatype Either(L: Type, R: Type) {
  inl(left: L): Either(L, R)
  inr(right: R): Either(L, R)
}
```

```cicada
let either_ind_t = (
  implicit L: Type,
  implicit R: Type,
  target: Either(L, R),
  motive: (Either(L, R)) -> Type,
  case_of_inl: (left: L) -> motive(Either.inl(left)),
  case_of_inr: (right: R) -> motive(Either.inr(right)),
) -> motive(target)
```

```cicada wishful-thinking
induction (target) {
  motive (target) => ...
  case inl(left) => ...
  case inr(right) => ...
}
```

## LessThan

```cicada wishful-thinking
datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest: (n: Nat) -> LessThan(Nat.zero, Nat.add1(n))
  add1_smaller: (
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ) -> LessThan(Nat.add1(j), Nat.add1(k))
}
```

We can not define `LessThan` as a datatype yet,
let's prepare some partial definitions:

```cicada
function LessThan(j: Nat, k: Nat): Type {
  return TODO
}

function zero_smallest(n: Nat): LessThan(Nat.zero, Nat.add1(n)) {
  return TODO
}

function add1_smaller(
  j: Nat, k: Nat,
  prev_smaller: LessThan(j, k),
): LessThan(Nat.add1(j), Nat.add1(k)) {
  return TODO
}
```

Then we can define `ind_less_than_t`:

```cicada
let ind_less_than_t = (
  implicit j: Nat,
  implicit k: Nat,
  target: LessThan(j, k),
  motive: (j: Nat, k: Nat, LessThan(j, k)) -> Type,
  case_of_zero_smallest: (n: Nat) -> motive(Nat.zero, Nat.add1(n), zero_smallest(n)),
  case_of_add1_smallest: (
    j: Nat, k: Nat, prev_smaller: LessThan(j, k),
    almost_of_prev_smaller: motive(j, k, prev_smaller),
  ) -> motive(Nat.add1(j), Nat.add1(k), add1_smaller(j, k, prev_smaller)),
) -> motive(j, k, target)
```

```cicada wishful-thinking
induction (target) {
  motive (j, k, lt) => ...
  case zero_smallest(n) => ...
  case add1_smaller(j, k, prev_smaller) (almost_of_prev_smaller) => ...
}
```

# Well-founded relation and Noetherian induction

It seems a generalization of structural induction is _Noetherian induction_,
which depends on the concept of [well-founded relation][].

[well-founded relation]: https://en.wikipedia.org/wiki/Well-founded_relation

Preparing some partial definitions:

```cicada
function Not(X: Type): Type {
  return (X) -> Absurd
}
```

Ideally we want to use subtype relation `<:` to denotes non-empty subset.

```cicada wishful-thinking
class WellFounded {
  X: Type
  Relation(X, X): Type
  minimal(S <: X): S
  minimality(S <: X, s: S) -> Not(Relation(s, minimal))
}
```

But we do not yet have `<:`.

Maybe we can view a property over `X` as a subset of `X`.

We also need to describe `NonEmptyProperty`:

```cicada
function NonEmptyProperty(implicit X: Type, P: (X) -> Type): Type {
  return exists (x: X) P(x)
}

class WellFounded {
  X: Type
  Relation(X, X): Type
  minimal(P: (X) -> Type, NonEmptyProperty(P)): class {
    element: X,
    property: P(element)
  }
  minimality(
    P: (X) -> Type, non_empty_property: NonEmptyProperty(P),
    s: X, P(s),
  ): Not(Relation(s, minimal(P, non_empty_property).element))

  // TODO [bug] The following wrong definition of `minimality` will throw
  //   RangeError: Invalid string length
  //       at JSON.stringify (<anonymous>)
  // minimality(
  //   P: (X) -> Type, NonEmptyProperty(P),
  //   s: X, P(s),
  // ): Not(Relation(s, minimal(P).element))
}
```

Maybe we should abstract `Subset` and `NonEmptySubset` first:

```cicada
class Subset {
  X: Type
  Property: (X) -> Type
  element: X
  element_included: Property(element)
}

class NonEmptySubset {
  X: Type
  Property: (X) -> Type

  exists_element: X
  exists_element_included: Property(exists_element)

  element: X
  element_included: Property(element)
}

class WellFounded2 {
  X: Type
  Relation(X, X): Type
  minimal(S: NonEmptySubset(X)): NonEmptySubset(X, S.Property)
  minimality(
    S: NonEmptySubset(X),
    s: NonEmptySubset(X, S.Property),
  ): Not(Relation(s.element, minimal(S).element))
}
```

When `Relation` is "less than",
`Relation(s, m)` reads "s less than m",
and `(Relation(s, m)) -> Absurd` reads:

- `s` not less than `m`
- `s` greater than or equal to `m`
- `m` less than or equal to `s`
- `m` is the minimal element of `S`

If minimal element exists,
there is no infinite sequence `x0, x1, x2, ...` of elements of `X`,

such that `x0 > x1 > x2 > ...`

Now! Noetherian induction!

```cicada
let noetherian_induction_t = (
  implicit X: Type,
  target: X,
  well_founded: WellFounded(X),
  motive: (X) -> Type,
  step: (
    x: X, y: X,
    (well_founded.Relation(y, x)) -> motive(y),
  ) -> motive(x),
) -> motive(target)
```

Seeing how Noether can observe the general pattern of induction,
and make a beautiful abstraction to capture the essence of the concept,
just like a seasoned programmer, who has a lot of experience in the domain,
designing a beautiful API.

**Exercise 1** Can you explain the intuition of Noetherian induction as a deduction rule?

- TODO
- Maybe it is about the finiteness guaranteed by well-founded-ness?

**Exercise 2** Can you view _structural induction_ as a special case of Noetherian induction?

**Exercise 2.1** Maybe we should try the usual _mathematical induction_ first:

- TODO

**Exercise 2.2** And we also should try _complete induction_, before we goes on:

- TODO

**Exercise 2.3** Now view _structural induction_ as a special case of Noetherian induction:

- TODO

# The duality between intro and elim rules and Adjoint functor

How to view the duality between intro and elim rules as a special case of adjoint functor?

TODO
