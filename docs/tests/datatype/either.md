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
  case_inl: (left: L) -> motive(inl(left)),
  case_inr: (right: R) -> motive(inr(right)),
): motive(target) {
  return either_ind(target, motive, case_inl, case_inr)
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
  case_just: (x: E) -> motive(just(x)),
  case_nothing: motive(nothing(E)),
): motive(target) {
  return induction_either(
    target,
    motive,
    case_just,
    (_) => case_nothing,
  )
}
```

# maybe_head

``` cicada
import { induction_list } from "./list.md"

function maybe_head(implicit E: Type, list: List(E)): Maybe(E) {
  return induction_list(
    list,
    (_) => Maybe(E),
    nothing(E),
    (head, _tail, _almost) => just(head),
  )
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
  maybe_head(the(List(String), li! [])),
  nothing(String),
]

same_as_chart! Maybe(String) [
  maybe_head(li! ["a"]),
  maybe_head(li! ["a", "b"]),
  maybe_head(li! ["a", "b", "c"]),
  just("a"),
]
```

# maybe_tail

``` cicada
function maybe_tail(implicit E: Type, list: List(E)): Maybe(List(E)) {
  return induction_list(
    list,
    (_) => Maybe(List(E)),
    nothing(List(E)),
    (_head, tail, _almost) => just(tail),
  )
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
  maybe_tail(the(List(String), li! [])),
  nothing(List(String)),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(li! ["a"]),
  just(the(List(String), li! [])),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(li! ["a", "b"]),
  just(the(List(String), li! ["b"])),
]

same_as_chart! Maybe(List(String)) [
  maybe_tail(li! ["a", "b", "c"]),
  just(the(List(String), li! ["b", "c"])),
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
        (tail) => almost(tail),
        nothing(E),
      )
    }
  ) (list)
}
```

``` cicada
list_ref_direct(0, li! ["a", "b", "c"])
list_ref_direct(1, li! ["a", "b", "c"])
list_ref_direct(2, li! ["a", "b", "c"])
list_ref_direct(3, li! ["a", "b", "c"])
list_ref_direct(4, li! ["a", "b", "c"])
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
        (tail) => almost(tail),
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
list_ref(0, li! ["a", "b", "c"])
list_ref(1, li! ["a", "b", "c"])
list_ref(2, li! ["a", "b", "c"])
list_ref(3, li! ["a", "b", "c"])
list_ref(4, li! ["a", "b", "c"])
```

## list_ref_fixed -- check-mode

If we can solve implicit arguments from return type in check-mode,
we can define `list_ref_fixed` directly.

``` cicada
function list_ref_fixed(fixed E: Type, index: Nat): (List(E)) -> Maybe(E) {
  return induction_nat(
    index,
    (_) => (List(E)) -> Maybe(E),
    (list) => maybe_head(list),
    (prev, almost) => (list) => {
      return induction_maybe(
        maybe_tail(list),
        (_) => Maybe(E),
        (tail) => almost(tail),
        nothing(E),
      )
    }
  )
}

check! list_ref_fixed: (fixed E: Type, index: Nat) -> (List(E)) -> Maybe(E)
```

``` cicada wishful-thinking
check! list_ref_fixed(0): (fixed E: Type) -> (List(E)) -> Maybe(E)

the(Maybe(String), list_ref_fixed(0, li! ["a", "b", "c"]))
the(Maybe(String), list_ref_fixed(1, li! ["a", "b", "c"]))
the(Maybe(String), list_ref_fixed(2, li! ["a", "b", "c"]))
the(Maybe(String), list_ref_fixed(3, li! ["a", "b", "c"]))
the(Maybe(String), list_ref_fixed(4, li! ["a", "b", "c"]))
```
