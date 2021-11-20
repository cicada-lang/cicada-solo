---
title: Vector
---

# Vector

``` cicada wishful-thinking
datatype Vector(E: Type) (length: Nat) {
  vecnil: Vector(E, Nat.zero)
  vec(
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}
```

``` cicada
datatype MyVector(E: Type) (length: Nat) {
  my_null: MyVector(E, zero)
  my_cons(
    head: E,
    implicit prev: Nat,
    tail: MyVector(E, prev),
  ): MyVector(E, add1(prev))
}

MyVector
MyVector(String)
MyVector(String, 3)
```

# induction Vector

``` cicada
induction_vector(
  implicit E: Type,
  implicit length: Nat,
  target: Vector(E, length),
  motive: (length: Nat, target: Vector(E, length)) -> Type,
  case_vecnil: motive(0, vecnil),
  case_vec: (
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
    almost_on_tail: motive(prev, tail),
  ) -> motive(add1(prev), vec(head, tail)),
): motive(length, target) {
  vector_ind(
    length,
    target,
    motive,
    case_vecnil,
    (_prev, head, tail, almost) => case_vec(head, tail, almost)
  )
}
```

# vector_append

``` cicada
import { add } from "./nat.md"

vector_append(
  implicit E: Type,
  implicit xl: Nat,
  x: Vector(E, xl),
  implicit yl: Nat,
  y: Vector(E, yl),
): Vector(E, add(xl, yl)) {
  induction_vector(
    x,
    (length, _target) => Vector(E, add(length, yl)),
    y,
    (head, _tail, almost) => vec(head, almost),
  )
}
```

``` cicada wishful-thinking
import { add } from "./nat.md"

vector_append(
  implicit E: Type,
  implicit xl: Nat,
  x: Vector(E, xl),
  implicit yl: Nat,
  y: Vector(E, yl),
): Vector(E, add(xl, yl)) {
  induction (x) {
    (length, _target) => Vector(E, add(length, yl))
    case vecnil => y
    case vec(head, _tail, almost) => Vector.vec(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! Vector(Nat, 5) [
  vector_append(
    the(Vector(Nat, 2), vec! [1, 2]),
    the(Vector(Nat, 3), vec! [3, 4, 5]),
  ),
  vec! [1, 2, 3, 4, 5],
]
```

# list_from_vector

``` cicada
list_from_vector(
  implicit E: Type,
  implicit length: Nat,
  vector: Vector(E, length),
): List(E) {
  induction_vector(
    vector,
    (length, target) => List(E),
    nil,
    (head, tail, almost) => li(head, almost),
  )
}
```

``` cicada wishful-thinking
list_from_vector(
  implicit E: Type,
  implicit length: Nat,
  vector: Vector(E, length),
): List(E) {
  induction (vector) {
    (length, target) => List(E)
    case vecnil => List.nil
    case vec(head, tail, almost) => List.li(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! List(Nat) [
  list_from_vector(
    the(Vector(Nat, 3), vec! [1, 2, 3])
  ),
  li! [1, 2, 3],
]
```
