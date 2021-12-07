---
title: Either
---

# Either

``` cicada
datatype Either(L: Type, R: Type) {
  inl(left: L): Either(L, R)
  inr(right: R): Either(L, R)
}
```

# induction Either

``` cicada
function induction_either(
  implicit L: Type,
  implicit R: Type,
  target: Either(L, R),
  motive: (Either(L, R)) -> Type,
  case_of_inl: (left: L) -> motive(Either.inl(left)),
  case_of_inr: (right: R) -> motive(Either.inr(right)),
): motive(target) {
  return induction (target) {
    motive
    case inl(left) => case_of_inl(left)
    case inr(right) => case_of_inr(right)
  }
}
```

# Maybe

``` cicada
datatype Maybe(E: Type) {
  nothing: Maybe(E)
  just(x: E): Maybe(E)
}
```

# example data

``` cicada
import { List } from "./list.md"

let a: List(String) = List.cons("a", List.null)
let ab: List(String) = List.cons("a", List.cons("b", List.null))
let abc: List(String) = List.cons("a", List.cons("b", List.cons("c", List.null)))
```

# maybe_head

``` cicada
function maybe_head(implicit E: Type, list: List(E)): Maybe(E) {
  return induction (list) {
    (_) => Maybe(E)
    case null => Maybe.nothing
    case cons(head, _tail, _almost) => Maybe.just(head)
  }
}
```

``` cicada
same_as_chart! Maybe(String) [
  maybe_head(the(List(String), List.null)),
  Maybe.nothing,
]

same_as_chart! Maybe(String) [
  maybe_head(a),
  maybe_head(ab),
  maybe_head(abc),
  Maybe.just("a"),
]
```

# maybe_tail

``` cicada
function maybe_tail(implicit E: Type, list: List(E)): Maybe(List(E)) {
  return induction (list) {
    (_) => Maybe(List(E))
    case null => Maybe.nothing
    case cons(_head, tail, _almost) => Maybe.just(tail)
  }
}
```

``` cicada
same_as_chart! Maybe(List(String)) [
  maybe_tail(the(List(String), List.null)),
  Maybe.nothing(vague List(String)),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(a),
  Maybe.just(the(List(String), List.null)),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(ab),
  Maybe.just(the(List(String), List.cons("b", List.null))),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(abc),
  Maybe.just(the(List(String), List.cons("b", List.cons("c", List.null)))),
]
```

# list_ref

``` cicada
import { induction_nat } from "./nat.md"
```

## list_ref_direct

``` cicada
function list_ref_direct(index: Nat, implicit E: Type, list: List(E)): Maybe(E) {
  return induction_nat(
    index,
    (_) => (List(E)) -> Maybe(E),
    (list) => maybe_head(list),
    (prev, almost) => (list) => {
      return induction (maybe_tail(list)) {
        (_) => Maybe(E)
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  ) (list)
}
```

``` cicada
list_ref_direct(0, abc)
list_ref_direct(1, abc)
list_ref_direct(2, abc)
list_ref_direct(3, abc)
list_ref_direct(4, abc)
```

## list_ref_aux

``` cicada
function list_ref_aux(E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction_nat(
    index,
    (_) => (List(E)) -> Maybe(E),
    (list) => maybe_head(list),
    (prev, almost) => (list) => {
      return induction (maybe_tail(list)) {
        (_) => Maybe(E)
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  )
}
```

``` cicada wishful-thinking
function list_ref_aux(E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction (index) {
    (_) => (List(E)) -> Maybe(E)
    case zero => (list) => maybe_head(list)
    case add1(prev, almost) => (list) => {
      return induction (maybe_tail(list)) {
        (_) => Maybe(E)
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  }
}
```

## list_ref by list_ref_aux

``` cicada
function list_ref(index: Nat, implicit E: Type, list: List(E)): Maybe(E) {
  return list_ref_aux(E, index, list)
}
```

``` cicada
list_ref(0, abc)
list_ref(1, abc)
list_ref(2, abc)
list_ref(3, abc)
list_ref(4, abc)

check! list_ref(0, abc): Maybe(String)
check! list_ref(1, abc): Maybe(String)
check! list_ref(2, abc): Maybe(String)
check! list_ref(3, abc): Maybe(String)
check! list_ref(4, abc): Maybe(String)
```

## list_ref_vague

``` cicada
function list_ref_vague(vague E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction_nat(
    index,
    (_) => (List(E)) -> Maybe(E),
    (list) => maybe_head(list),
    (prev, almost) => (list) => {
      return induction (maybe_tail(list)) {
        (_) => Maybe(E)
        case nothing => Maybe.nothing
        case just(tail) => almost.prev(tail)
      }
    }
  )
}

list_ref_vague(vague String, 0, abc)
check! list_ref_vague(vague String, 0, abc): Maybe(String)

check! list_ref_vague(0, abc): Maybe(String)
```

``` cicada
check! list_ref_vague(0, abc): Maybe(String)
check! list_ref_vague(1, abc): Maybe(String)
check! list_ref_vague(2, abc): Maybe(String)
check! list_ref_vague(3, abc): Maybe(String)
check! list_ref_vague(4, abc): Maybe(String)
```
