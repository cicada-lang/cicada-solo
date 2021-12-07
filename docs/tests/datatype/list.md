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
check! List(Nat): Type

check! List.null: List(Nat)
check! List.null(vague Nat): List(Nat)

check! List.null: List(String)
check! List.null(vague String): List(String)
check! List.cons(1, List.null): List(Nat)

check! List.cons(1, List.null): List(Nat)
check! List.cons(1, List.cons(2, List.null)): List(Nat)
check! List.cons(1, List.cons(2, List.cons(3, List.null))): List(Nat)

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
function length(implicit E: Type, x: List(E)): Nat {
  return induction (x) {
    (_) => Nat
    case null => 0
    case cons(_head, _tail, almost) => add1(almost.tail)
  }
}
```

``` cicada
same_as_chart! Nat [
  length(the(List(Nat), List.cons(1, List.cons(2, List.cons(3, List.null))))),
  length(the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null))))),
  3,
]
```

# append

``` cicada
function append(implicit E: Type, x: List(E), y: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case null => y
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! List(Nat) [
  append(
    the(List(Nat), List.cons(1, List.cons(2, List.cons(3, List.null)))),
    the(List(Nat), List.cons(4, List.cons(5, List.cons(6, List.null)))),
  ),
  List.cons(1, List.cons(2, List.cons(3, List.cons(4, List.cons(5, List.cons(6, List.null)))))),
]
```

# reverse

``` cicada
function list_cons_back(implicit E: Type, e: E, x: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case null => List.cons(e, List.null)
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}

function reverse(implicit E: Type, x: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case null => List.null
    case cons(head, _tail, almost) => list_cons_back(head, almost.tail)
  }
}
```

``` cicada
same_as_chart! List(Nat) [
  list_cons_back(4, List.cons(1, List.cons(2, List.cons(3, List.null)))),
  List.cons(1, List.cons(2, List.cons(3, List.cons(4, List.null))))
]

same_as_chart! List(Nat) [
  reverse(the(List(Nat), List.cons(1, List.cons(2, List.cons(3, List.null))))),
  List.cons(3, List.cons(2, List.cons(1, List.null))),
]
```
