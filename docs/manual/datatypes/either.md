---
title: Either
---

# Either

```cicada
datatype Either(L: Type, R: Type) {
  inl(left: L): Either(L, R)
  inr(right: R): Either(L, R)
}
```

# induction Either

```cicada
function induction_either(
  implicit L: Type,
  implicit R: Type,
  target: Either(L, R),
  motive: (Either(L, R)) -> Type,
  case_of_inl: (left: L) -> motive(Either.inl(left)),
  case_of_inr: (right: R) -> motive(Either.inr(right)),
): motive(target) {
  return induction (target) {
    motive motive
    case inl(left) => case_of_inl(left)
    case inr(right) => case_of_inr(right)
  }
}
```

# Maybe

```cicada
datatype Maybe(E: Type) {
  nothing: Maybe(E)
  just(x: E): Maybe(E)
}
```

# example data

```cicada
import { List } from "./list.md"

let a: List(String) = List.cons("a", List.null)
let ab: List(String) = List.cons("a", List.cons("b", List.null))
let abc: List(String) = List.cons("a", List.cons("b", List.cons("c", List.null)))
```

# maybe_head

```cicada
function maybe_head(implicit E: Type, list: List(E)): Maybe(E) {
  return recursion (list) {
    case null => Maybe.nothing
    case cons(head, _tail, _almost) => Maybe.just(head)
  }
}
```

```cicada
compute same_as_chart (Maybe(String)) [
  maybe_head(the(List(String), List.null)),
  Maybe.nothing,
]

compute same_as_chart (Maybe(String)) [
  maybe_head(a),
  maybe_head(ab),
  maybe_head(abc),
  Maybe.just("a"),
]
```

# maybe_tail

```cicada
function maybe_tail(implicit E: Type, list: List(E)): Maybe(List(E)) {
  return recursion (list) {
    case null => Maybe.nothing
    case cons(_head, tail, _almost) => Maybe.just(tail)
  }
}
```

```cicada
compute same_as_chart (Maybe(List(String))) [
  maybe_tail(the(List(String), List.null)),
  Maybe.nothing(vague List(String)),
]

compute same_as_chart (Maybe(List(String))) [
  maybe_tail(a),
  Maybe.just(the(List(String), List.null)),
]

compute same_as_chart (Maybe(List(String))) [
  maybe_tail(ab),
  Maybe.just(the(List(String), List.cons("b", List.null))),
]

compute same_as_chart (Maybe(List(String))) [
  maybe_tail(abc),
  Maybe.just(the(List(String), List.cons("b", List.cons("c", List.null)))),
]
```

# list_ref

```cicada
import { Nat, zero, one, two, three, four } from "./nat.md"
```

## list_ref_direct

```cicada
function list_ref_direct(index: Nat, implicit E: Type, list: List(E)): Maybe(E) {
  return induction (index) {
    motive (_) => (List(E)) -> Maybe(E)
    case zero => (list) => maybe_head(list)
    case add1(prev, almost) => (list) => {
      return recursion (maybe_tail(list)) {
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  } (list)
}
```

```cicada
compute list_ref_direct(zero, abc)
compute list_ref_direct(one, abc)
compute list_ref_direct(two, abc)
compute list_ref_direct(three, abc)
compute list_ref_direct(four, abc)
```

## list_ref_aux

```cicada
function list_ref_aux(E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction (index) {
    motive (_) => (List(E)) -> Maybe(E)
    case zero => (list) => maybe_head(list)
    case add1(prev, almost) => (list) => {
      return recursion (maybe_tail(list)) {
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  }
}
```

## list_ref by list_ref_aux

```cicada
function list_ref(index: Nat, implicit E: Type, list: List(E)): Maybe(E) {
  return list_ref_aux(E, index, list)
}
```

```cicada
compute list_ref(zero, abc)
compute list_ref(one, abc)
compute list_ref(two, abc)
compute list_ref(three, abc)
compute list_ref(four, abc)

check list_ref(zero, abc): Maybe(String)
check list_ref(one, abc): Maybe(String)
check list_ref(two, abc): Maybe(String)
check list_ref(three, abc): Maybe(String)
check list_ref(four, abc): Maybe(String)
```

## list_ref_vague

```cicada
function list_ref_vague(vague E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return recursion (index) {
    case zero => (list) => maybe_head(list)
    case add1(prev, almost) => (list) => {
      return recursion (maybe_tail(list)) {
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  }
}

check list_ref_vague(vague String, zero, abc): Maybe(String)
check list_ref_vague(zero, abc): Maybe(String)
```

```cicada
check list_ref_vague(zero, abc): Maybe(String)
check list_ref_vague(one, abc): Maybe(String)
check list_ref_vague(two, abc): Maybe(String)
check list_ref_vague(three, abc): Maybe(String)
check list_ref_vague(four, abc): Maybe(String)
```
