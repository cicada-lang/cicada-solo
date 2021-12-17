---
title: List
---

# List

``` cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}

check! List: (Type) -> Type
check! List(String): Type

check! List.null: List(String)
check! List.null(vague String): List(String)

check! List.cons("a", List.null): List(String)
check! List.cons("a", List.cons("b", List.null)): List(String)
check! List.cons("a", List.cons("b", List.cons("c", List.null))): List(String)
```

# induction List

``` cicada
function induction_list(
  implicit E: Type,
  target: List(E),
  motive: (List(E)) -> Type,
  case_of_null: motive(List.null),
  case_of_cons: (
    head: E, tail: List(E),
    almost: class { tail: motive(tail) },
  ) -> motive(List.cons(head, tail)),
): motive(target) {
  return induction (target) {
    motive
    case null => case_of_null
    case cons(head, tail, almost) => case_of_cons(head, tail, almost)
  }
}
```

# length

``` cicada
import { Nat } from "./nat.md"

function length(implicit E: Type, x: List(E)): Nat {
  return induction (x) {
    case null => Nat.zero
    case cons(_head, _tail, almost) => Nat.add1(almost.tail)
  }
}
```

``` cicada
same_as_chart! (Nat) [
  length(the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null))))),
  Nat.add1(Nat.add1(Nat.add1(Nat.zero))),
]
```

# append

``` cicada
function append(implicit E: Type, x: List(E), y: List(E)): List(E) {
  return induction (x) {
    case null => y
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! (List(String)) [
  append(
    the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null)))),
    the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null)))),
  ),
  List.cons("a", List.cons("b", List.cons("c", List.cons("a", List.cons("b", List.cons("c", List.null)))))),
]
```

# reverse

``` cicada
function list_cons_back(implicit E: Type, e: E, x: List(E)): List(E) {
  return induction (x) {
    case null => List.cons(e, List.null)
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}

function reverse(implicit E: Type, x: List(E)): List(E) {
  return induction (x) {
    case null => List.null
    case cons(head, _tail, almost) => list_cons_back(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! (List(String)) [
  list_cons_back("d", List.cons("a", List.cons("b", List.cons("c", List.null)))),
  List.cons("a", List.cons("b", List.cons("c", List.cons("d", List.null))))
]

same_as_chart! (List(String)) [
  reverse(the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null))))),
  List.cons("c", List.cons("b", List.cons("a", List.null))),
]
```
