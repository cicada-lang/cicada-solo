---
title: Either
---

# Either

``` cicada wishful-thinking
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
  case_of_inl: (left: L) -> motive(inl(left)),
  case_of_inr: (right: R) -> motive(inr(right)),
): motive(target) {
  return either_ind(target, motive, case_of_inl, case_of_inr)
}
```

# Maybe

``` cicada
function Maybe(E: Type): Type {
  return Either(E, Trivial)
}

function nothing(E: Type): Maybe(E) {
  return inr(sole)
}

function just(implicit E: Type, x: E): Maybe(E) {
  return inl(x)
}
```

``` cicada wishful-thinking
datatype Maybe(E: Type) {
  nothing: Maybe(E)
  just(x: E): Maybe(E)
}
```

# induction Maybe

``` cicada
function induction_maybe(
  implicit E: Type,
  target: Maybe(E),
  motive: (Maybe(E)) -> Type,
  case_of_just: (x: E) -> motive(just(x)),
  case_of_nothing: motive(nothing(E)),
): motive(target) {
  return induction_either(
    target,
    motive,
    case_of_just,
    (_) => case_of_nothing,
  )
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
    case null => nothing(E)
    case cons(head, _tail, _almost) => just(head)
  }
}
```

``` cicada wishful-thinking
function maybe_head(implicit E: Type, list: List(E)): Maybe(E) {
  return induction (list) {
    () => Maybe(E)
    case nil => Maybe.nothing
    case li(head, _tail, _almost) => Maybe.just(head)
  }
}
```

``` cicada
same_as_chart! Maybe(String) [
  maybe_head(the(List(String), List.null)),
  nothing(String),
]

same_as_chart! Maybe(String) [
  maybe_head(a),
  maybe_head(ab),
  maybe_head(abc),
  just("a"),
]
```

# maybe_tail

``` cicada
function maybe_tail(implicit E: Type, list: List(E)): Maybe(List(E)) {
  return induction (list) {
    (_) => Maybe(List(E))
    case null => nothing(List(E))
    case cons(_head, tail, _almost) => just(tail)
  }
}
```

``` cicada wishful-thinking
function maybe_tail(implicit E: Type, list: List(E)): Maybe(List(E)) {
  return induction (list) {
    (_) => Maybe(List(E))
    case nil => Maybe.nothing
    case li(_head, tail, _almost) => Maybe.just(tail)
  }
}
```

``` cicada
same_as_chart! Maybe(List(String)) [
  maybe_tail(the(List(String), List.null)),
  nothing(List(String)),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(a),
  just(the(List(String), List.null)),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(ab),
  just(the(List(String), List.cons("b", List.null))),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(abc),
  just(the(List(String), List.cons("b", List.cons("c", List.null)))),
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
      return induction_maybe(
        maybe_tail(list),
        (_) => Maybe(E),
        (tail) => almost.prev(tail),
        nothing(E),
      )
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
      return induction_maybe(
        maybe_tail(list),
        (_) => Maybe(E),
        (tail) => almost.prev(tail),
        nothing(E),
      )
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
        case just(tail) => almost.prev(tail)
        case nothing => Maybe.nothing
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

check! list_ref(0, abc): Either(String, Trivial)
check! list_ref(1, abc): Either(String, Trivial)
check! list_ref(2, abc): Either(String, Trivial)
check! list_ref(3, abc): Either(String, Trivial)
check! list_ref(4, abc): Either(String, Trivial)
```

## list_ref_vague

``` cicada
function list_ref_vague(vague E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction_nat(
    index,
    (_) => (List(E)) -> Maybe(E),
    (list) => maybe_head(list),
    (prev, almost) => (list) => {
      return induction_maybe(
        maybe_tail(list),
        (_) => Maybe(E),
        (tail) => almost.prev(tail),
        nothing(E),
      )
    }
  )
}

list_ref_vague(vague String, 0, abc)
check! list_ref_vague(vague String, 0, abc): Either(String, Trivial)

check! list_ref_vague(0, abc): Either(String, Trivial)
```

``` cicada
check! list_ref_vague(0, abc): Either(String, Trivial)
check! list_ref_vague(1, abc): Either(String, Trivial)
check! list_ref_vague(2, abc): Either(String, Trivial)
check! list_ref_vague(3, abc): Either(String, Trivial)
check! list_ref_vague(4, abc): Either(String, Trivial)
```
