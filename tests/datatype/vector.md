---
title: Vector
---

# Vector

``` cicada wishful-thinking
datatype Vector(E: Type) (length: Nat) {
  vecnil: Vector(E, Nat.zero)
  vec(
    head: E,
    implicit { prev: Nat },
    tail: Vector(E, prev),
  ): Vector(E, Nat.add1(prev))
}
```

# induction Vector

``` cicada
induction_vector(
  E: Type,
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
  implicit { length: Nat },
  target: Vector(E, length),
): motive(length, target) {
  vector_ind(
    length,
    target,
    motive,
    case_vecnil,
    (prev, head, tail, almost) => case_vec(head, tail, almost)
  )
}
```

# vector_append

``` cicada
import { add } from "./nat.md"

vector_append(
  E: Type,
  xl: Nat, yl: Nat,
  x: Vector(E, xl),
  y: Vector(E, yl),
): Vector(E, add(xl, yl)) {
  vector_ind(
    xl,
    x,
    (length, _target) => Vector(E, add(length, yl)),
    y,
    (prev, head, _tail, almost) => vec(head, almost)
  )
}
```

``` cicada
same_as_chart! Vector(Nat, 5) [
  vector_append(Nat, 2, 3, vec! [1, 2], vec! [3, 4, 5]),
]
```
