---
title: Vector
---

# Vector

``` cicada
import { Nat, zero, one, two, three, four, five, six } from "./nat.md"

datatype Vector(E: Type) (length: Nat) {
  null: Vector(E, Nat.zero)
  cons(
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}

Vector
Vector(String)
Vector(String, Nat.zero)

Vector.null
Vector.null(vague Nat)

Vector.cons

check! Vector.null: Vector(String, zero)
check! Vector.cons(one, Vector.null): Vector(Nat, one)
check! Vector.cons(vague Nat, one, Vector.null): Vector(Nat, one)
check! Vector.cons(vague Nat, vague zero, one, Vector.null): Vector(Nat, one)

check! Vector.cons("a", Vector.null): Vector(String, one)
check! Vector.cons(vague String, "a", Vector.null): Vector(String, one)
check! Vector.cons(vague String, vague zero, "a", Vector.null): Vector(String, one)

check! Vector.cons("a", Vector.cons("b", Vector.cons("c", Vector.null))): Vector(String, three)
```

We can bind partly applied data constructor to local variable.

``` cicada
check! {
  let f = Vector.cons(vague Nat, vague zero, one)
  return f(Vector.null)
}: Vector(Nat, one)

// NOTE But remind that vague function can not be (auto) curried.
//   thus the following code is not valid.
// check! {
//   let f = Vector.cons(one)
//   return f(Vector.null)
// }: Vector(Nat, one)

// NOTE Although we can *not* get a curried data constructor for free,
//   we can define a vague function by hand,
//   as an abstraction over data construction.
check! {
  function f(
    vague prev: Nat,
    tail: Vector(String, prev),
  ): Vector(String, Nat.add1(prev)) {
    return Vector.cons("a")
  }

  return f(Vector.null)
}: Vector(String, one)
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
) -> Vector(String, Nat.add1(prev))

check! {
  let f = Vector.cons(vague String)
  return f("a", Vector.null)
}: Vector(String, one)
```

# induction Vector

``` cicada
function induction_vector(
  implicit E: Type,
  implicit length: Nat,
  target: Vector(E, length),
  motive: (length: Nat, Vector(E, length)) -> Type,
  case_of_null: motive(zero, Vector.null),
  case_of_cons: (
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
    almost: class { tail: motive(prev, tail) },
  ) -> motive(Nat.add1(prev), Vector.cons(head, tail)),
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
same_as_chart! (Vector(Nat, five)) [
  vector_append(
    the(
      Vector(Nat, two),
      Vector.cons(one, Vector.cons(two, Vector.null))),
    the(
      Vector(Nat, three),
      Vector.cons(three, Vector.cons(four, Vector.cons(five, Vector.null)))
    ),
  ),
  the(
    Vector(Nat, five),
    Vector.cons(one, Vector.cons(two, Vector.cons(three, Vector.cons(four, Vector.cons(five, Vector.null)))))
  ),
  Vector.cons(one, Vector.cons(two, Vector.cons(three, Vector.cons(four, Vector.cons(five, Vector.null))))),
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
    case null => List.null
    case cons(head, tail, almost) => List.cons(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! (List(Nat)) [
  list_from_vector(
    the(Vector(Nat, three), Vector.cons(one, Vector.cons(two, Vector.cons(three, Vector.null))))
  ),
  List.cons(one, List.cons(two, List.cons(three, List.null))),
]
```
