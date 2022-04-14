---
section: Implicit & Vague
title: Implicit Pi
---

# pi type with implicit argument and implicit function insertion

Let's write the identity function with implicit type argument.

- `id1` is the same as `id2`, just in different syntax.
- for `id1` and `id2`, an implicit function will be inserted to get `id3`.

```cicada
function id1(implicit A: Type, x: A): A {
  return x
}

let id2: (implicit A: Type, x: A) -> A = (x) => x
let id3: (implicit A: Type, x: A) -> A = (implicit A, x) => x

compute id1
compute id2
compute id3

compute id1("a")
compute id2("a")
compute id3("a")
```

# return implicit value

```cicada
function typeof(implicit T: Type, T): Type {
  return T
}

compute typeof(sole)
compute typeof("abc")
```

# multiple implicit arguments

```cicada
function k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  return x
}

compute k("abc", sole)
```

# record of implicit arguments

```cicada
let car_type_t = (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type

compute car_type_t

function car_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  return A
}

compute car_type

let car_type_again: (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type = (implicit A, implicit B, pair) => A


compute car_type_again

compute car_type(the(Pair(Trivial, String), cons(sole, "a")))
compute car_type_again(the(Pair(Trivial, String), cons(sole, "a")))

// `cdr_type` -- only the idiomatic way:

function cdr_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  return B
}

compute cdr_type(the(Pair(Trivial, String), cons(sole, "a")))
```

# do _not_ support implicit argument over implicit argument

```cicada counterexample
function k(
  implicit A: Type,
  implicit B: Type,
  x: A,
  y: B,
): A {
  return x
}
```

# do _not_ support implicit argument over one argument

```cicada counterexample
function k(
  implicit A: Type,
  Trivial,
  x: A,
): A {
  return x
}
```

# my_car & my_cdr

Definition is ok, but unification will fail, during the use of `my_car` and `my_cdr`,
because we can not unify function yet.

```cicada
function my_car(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: exists (x: A) B(x),
): A {
  return car(pair)
}

compute my_car

function my_cdr(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: exists (x: A) B(x),
): B(car(pair)) {
  return cdr(pair)
}

compute my_cdr
```
