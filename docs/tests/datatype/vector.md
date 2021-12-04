---
title: Vector
---

# Vector

``` cicada wishful-thinking
datatype Vector(E: Type) (length: Nat) {
  vecnil: Vector(E, Nat.zero)
  vec(
    vague prev: Nat,
    head: E,
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}
```

``` cicada
datatype MyVector(E: Type) (length: Nat) {
  my_null: MyVector(E, zero)
  my_cons(
    vague prev: Nat,
    head: E,
    tail: MyVector(E, prev),
  ): MyVector(E, add1(prev))
}

MyVector
MyVector(String)
MyVector(String, 3)

MyVector.my_null
MyVector.my_null(vague Nat)

check! MyVector.my_null: MyVector(Nat, 0)
check! MyVector.my_null: MyVector(String, 0)

check! MyVector.my_cons(1, MyVector.my_null): MyVector(Nat, 1)
check! MyVector.my_cons(vague Nat, 1, MyVector.my_null): MyVector(Nat, 1)
check! MyVector.my_cons(vague Nat, vague 0, 1, MyVector.my_null): MyVector(Nat, 1)

check! MyVector.my_cons("a", MyVector.my_null): MyVector(String, 1)
check! MyVector.my_cons(vague String, "a", MyVector.my_null): MyVector(String, 1)
check! MyVector.my_cons(vague String, vague 0, "a", MyVector.my_null): MyVector(String, 1)

check! MyVector.my_cons("a", MyVector.my_cons("b", MyVector.my_cons("c", MyVector.my_null))): MyVector(String, 3)
```

We can bind partly applied data constructor to local variable.

``` cicada
check! {
  let f = MyVector.my_cons(vague Nat, vague 0, 1)
  return f(MyVector.my_null)
}: MyVector(Nat, 1)

// NOTE But remind that vague function can not be (auto) curried.
//   thus the following code is not valid.
// check! {
//   let f = MyVector.my_cons(1)
//   return f(MyVector.my_null)
// }: MyVector(Nat, 1)

// NOTE Although we can *not* get a curried data constructor for free,
//   we can define a vague function by hand,
//   as an abstraction over data construction.
check! {
  function f(
    vague prev: Nat,
    tail: MyVector(String, prev),
  ): MyVector(String, add1(prev)) {
    return MyVector.my_cons("a")
  }

  return f(MyVector.my_null)
}: MyVector(String, 1)
```

``` cicada
// NOTE Application to given vague argument can be curried.
check! {
  let f = MyVector.my_cons(vague String)
  return f
}: (
  vague prev: Nat,
  head: String,
  tail: MyVector(String, prev),
) -> MyVector(String, add1(prev))

check! {
  let f = MyVector.my_cons(vague String)
  return f("a", MyVector.my_null)
}: MyVector(String, 1)
```

# induction Vector

``` cicada
function induction_vector(
  implicit E: Type,
  implicit length: Nat,
  target: Vector(E, length),
  motive: (length: Nat, target: Vector(E, length)) -> Type,
  case_of_vecnil: motive(0, vecnil),
  case_of_vec: (
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
    almost: class { tail: motive(prev, tail) },
  ) -> motive(add1(prev), vec(head, tail)),
): motive(length, target) {
  return vector_ind(
    length,
    target,
    motive,
    case_of_vecnil,
    (_prev, head, tail, almost_of_tail) => case_of_vec(head, tail, { tail: almost_of_tail })
  )
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
  return induction_vector(
    x,
    (length, _target) => Vector(E, add(length, yl)),
    y,
    (head, _tail, almost) => vec(head, almost.tail),
  )
}
```

``` cicada wishful-thinking
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
function list_from_vector(
  implicit E: Type,
  implicit length: Nat,
  vector: Vector(E, length),
): List(E) {
  return induction_vector(
    vector,
    (length, target) => List(E),
    nil,
    (head, tail, almost) => li(head, almost.tail),
  )
}
```

``` cicada wishful-thinking
function list_from_vector(
  implicit E: Type,
  implicit length: Nat,
  vector: Vector(E, length),
): List(E) {
  return induction (vector) {
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
