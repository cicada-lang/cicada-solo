---
title: List
---

If `Nat` is the most basic `datatype`,
`List` is the next basic `datatype`.

# List

```cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

After the definition, `List` taken a `Type` is a `Type`.

```cicada
check List: (E: Type) -> Type
check List(String): Type
check List(Trivial): Type
```

Let construct a `List` of "a", "b", "c", step by step.

```cicada
check List.null: List(String)
check List.cons("a", List.null): List(String)
check List.cons("a", List.cons("b", List.null)): List(String)
check List.cons("a", List.cons("b", List.cons("c", List.null))): List(String)
```

# About induction over List

```cicada
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
    motive motive
    case null => case_of_null
    case cons(head, tail, almost) => case_of_cons(head, tail, almost)
  }
}
```

# length

```cicada
import { Nat } from "./nat.md"

function length(implicit E: Type, x: List(E)): Nat {
  return recursion (x) {
    case null => Nat.zero
    case cons(_head, _tail, almost) => Nat.add1(almost.tail)
  }
}
```

```cicada
compute same_as_chart (Nat) [
  length(the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null))))),
  Nat.add1(Nat.add1(Nat.add1(Nat.zero))),
]
```

# append

```cicada
function append(implicit E: Type, x: List(E), y: List(E)): List(E) {
  return recursion (x) {
    case null => y
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}
```

```cicada
compute same_as_chart (List(String)) [
  append(
    the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null)))),
    the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null)))),
  ),
  List.cons("a", List.cons("b", List.cons("c", List.cons("a", List.cons("b", List.cons("c", List.null)))))),
]
```

# map

```cicada
function map(
  implicit E: Type, x: List(E),
  implicit R: Type, f: (E) -> R,
): List(R) {
  return recursion (x) {
    case null => List.null
    case cons(head, _tail, almost) => List.cons(f(head), almost.tail)
  }
}
```

```cicada
compute {
  let x: List(Nat) =
    List.cons(Nat.zero,
      List.cons(Nat.add1(Nat.zero),
        List.cons(Nat.add1(Nat.add1(Nat.zero)),
          List.null)))

  let expected: List(Nat) =
    List.cons(Nat.add1(Nat.zero),
      List.cons(Nat.add1(Nat.add1(Nat.zero)),
        List.cons(Nat.add1(Nat.add1(Nat.add1(Nat.zero))),
          List.null)))

  return same_as_chart (List(Nat)) [
    map(x, Nat.add1),
    expected,
  ]
}
```

# reverse

```cicada
function list_cons_back(implicit E: Type, e: E, x: List(E)): List(E) {
  return recursion (x) {
    case null => List.cons(e, List.null)
    case cons(head, _tail, almost) => List.cons(head, almost.tail)
  }
}

function reverse(implicit E: Type, x: List(E)): List(E) {
  return recursion (x) {
    case null => List.null
    case cons(head, _tail, almost) => list_cons_back(head, almost.tail)
  }
}
```

```cicada
compute same_as_chart (List(String)) [
  list_cons_back("d", List.cons("a", List.cons("b", List.cons("c", List.null)))),
  List.cons("a", List.cons("b", List.cons("c", List.cons("d", List.null))))
]

compute same_as_chart (List(String)) [
  reverse(the(List(String), List.cons("a", List.cons("b", List.cons("c", List.null))))),
  List.cons("c", List.cons("b", List.cons("a", List.null))),
]
```
