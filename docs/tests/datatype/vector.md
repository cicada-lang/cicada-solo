---
title: Vector
---

# Vector

``` cicada
datatype Vector(E: Type) (length: Nat) {
  null: Vector(E, zero)
  cons(
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
  ): Vector(E, add1(prev))
}

Vector
Vector(String)
Vector(String, 3)

Vector.null
Vector.null(vague Nat)

check! Vector.null: Vector(Nat, 0)
check! Vector.null: Vector(String, 0)

check! Vector.cons(1, Vector.null): Vector(Nat, 1)
check! Vector.cons(vague Nat, 1, Vector.null): Vector(Nat, 1)
check! Vector.cons(vague Nat, vague 0, 1, Vector.null): Vector(Nat, 1)

check! Vector.cons("a", Vector.null): Vector(String, 1)
check! Vector.cons(vague String, "a", Vector.null): Vector(String, 1)
check! Vector.cons(vague String, vague 0, "a", Vector.null): Vector(String, 1)

check! Vector.cons("a", Vector.cons("b", Vector.cons("c", Vector.null))): Vector(String, 3)
```

We can bind partly applied data constructor to local variable.

``` cicada
check! {
  let f = Vector.cons(vague Nat, vague 0, 1)
  return f(Vector.null)
}: Vector(Nat, 1)

// NOTE But remind that vague function can not be (auto) curried.
//   thus the following code is not valid.
// check! {
//   let f = Vector.cons(1)
//   return f(Vector.null)
// }: Vector(Nat, 1)

// NOTE Although we can *not* get a curried data constructor for free,
//   we can define a vague function by hand,
//   as an abstraction over data construction.
check! {
  function f(
    vague prev: Nat,
    tail: Vector(String, prev),
  ): Vector(String, add1(prev)) {
    return Vector.cons("a")
  }

  return f(Vector.null)
}: Vector(String, 1)
```

``` cicada
// NOTE Application to given vague argument can be curried.
check! {
  let f = Vector.cons(vague String)
  return f
}: (
  vague prev: Nat,
  head: String,
  tail: Vector(String, prev),
) -> Vector(String, add1(prev))

check! {
  let f = Vector.cons(vague String)
  return f("a", Vector.null)
}: Vector(String, 1)
```

# induction Vector

``` cicada
function induction_vector(
  implicit E: Type,
  implicit length: Nat,
  target: Vector(E, length),
  motive: (length: Nat, Vector(E, length)) -> Type,
  case_of_null: motive(0, Vector.null),
  case_of_cons: (
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
    almost: class { tail: motive(prev, tail) },
  ) -> motive(add1(prev), Vector.cons(head, tail)),
): motive(length, target) {
  return induction (target) {
    motive
    case null => case_of_null
    case cons(head, tail, almost) => case_of_cons(head, tail, almost)
  }
}
```

# vector_append

``` cicada
import { add } from "./nat.md"

function vector_append(
  implicit E: Type,
  implicit xl: Nat,
  x: Vector(E, xl),
  implicit yl: Nat,
  y: Vector(E, yl),
): Vector(E, add(xl, yl)) {
  return induction (x) {
    (length, _target) => Vector(E, add(length, yl))
    case null => y
    case cons(head, _tail, almost) => Vector.cons(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! Vector(Nat, 5) [
  vector_append(
    the(
      Vector(Nat, 2),
      Vector.cons(1, Vector.cons(2, Vector.null))),
    the(
      Vector(Nat, 3),
      Vector.cons(3, Vector.cons(4, Vector.cons(5, Vector.null)))
    ),
  ),
  the(
    Vector(Nat, 5),
    Vector.cons(1, Vector.cons(2, Vector.cons(3, Vector.cons(4, Vector.cons(5, Vector.null)))))
  ),
  Vector.cons(1, Vector.cons(2, Vector.cons(3, Vector.cons(4, Vector.cons(5, Vector.null))))),
]
```

# list_from_vector

``` cicada
import { List } from "./list.md"

function list_from_vector(
  implicit E: Type,
  implicit length: Nat,
  vector: Vector(E, length),
): List(E) {
  return induction (vector) {
    (length, target) => List(E)
    case null => List.null
    case cons(head, tail, almost) => List.cons(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! List(Nat) [
  list_from_vector(
    the(Vector(Nat, 3), Vector.cons(1, Vector.cons(2, Vector.cons(3, Vector.null))))
  ),
  List.cons(1, List.cons(2, List.cons(3, List.null))),
]
```
