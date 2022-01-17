---
section: Implicit & Vague
title: Implicit Pi
---

> **Works on this chapter is not finished yet.**

# pi type with implicit argument and implicit function insertion

Let's write the identity function with implicit type argument.

- `id1` is the same as `id2`, just in different syntax.
- for `id1` and `id2`, an implicit function will be inserted to get `id3`.

``` cicada
function id1(implicit A: Type, x: A): A {
  return x
}

let id2: (implicit A: Type, x: A) -> A = (x) => x
let id3: (implicit A: Type, x: A) -> A = (implicit A, x) => x

id1
id2
id3

id1("a")
id2("a")
id3("a")
```

# return implicit value

``` cicada
function typeof(implicit T: Type, T): Type {
  return T
}

typeof(sole)
typeof("abc")
```

# multiple implicit arguments

``` cicada
function k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  return x
}

k("abc", sole)
```

# record of implicit arguments

``` cicada
let car_type_t = (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type

car_type_t

function car_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  return A
}

car_type

let car_type_again: (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type = (implicit A, implicit B, pair) => A


car_type_again

car_type(the(Pair(Trivial, String), cons(sole, "a")))
car_type_again(the(Pair(Trivial, String), cons(sole, "a")))

// `cdr_type` -- only the idiomatic way:

function cdr_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  return B
}

cdr_type(the(Pair(Trivial, String), cons(sole, "a")))
```

# do *not* support implicit argument over implicit argument

``` cicada counterexample
function k(
  implicit A: Type,
  implicit B: Type,
  x: A,
  y: B,
): A {
  return x
}
```

# do *not* support implicit argument over one argument

``` cicada counterexample
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

``` cicada
function my_car(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: [x: A | B(x)],
): A {
  return car(pair)
}

my_car

function my_cdr(
  implicit A: Type,
  implicit B: (x: A) -> Type,
  pair: [x: A | B(x)],
): B(car(pair)) {
  return cdr(pair)
}

my_cdr
```
