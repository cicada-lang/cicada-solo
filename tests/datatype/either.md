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
induction_either(
  implicit { L: Type, R: Type },
  target: Either(L, R),
  motive: (Either(L, R),) -> Type,
  case_inl: (left: L) -> motive(inl(left)),
  case_inr: (right: R) -> motive(inr(right)),
): motive(target) {
  either_ind(target, motive, case_inl, case_inr)
}
```

# Maybe

``` cicada
Maybe(E: Type): Type {
  Either(E, Trivial)
}

nothing(E: Type): Maybe(E) {
  inr(sole)
}

just(implicit { E: Type }, x: E): Maybe(E) {
  inl(x)
}
```

``` cicada wishful-thinking
datatype Maybe(E: Type) {
  nothing: Maybe(E)
  just(x: E): Maybe(E)
}
```

# maybe_head

``` cicada
maybe_head(implicit { E: Type }, list: List(E)): Maybe(E) {
  list_rec(
    list,
    nothing(E),
    (head, _tail, _almost) => just(head)
  )
}
```

``` cicada wishful-thinking
maybe_head(implicit { E: Type }, list: List(E)): Maybe(E) {
  induction (list) {
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
maybe_tail(implicit { E: Type }, list: List(E)): Maybe(List(E)) {
  list_rec(
    list,
    nothing(List(E)),
    (_head, tail, _almost) => just(tail)
  )
}
```

``` cicada wishful-thinking
maybe_tail(implicit { E: Type }, list: List(E)): Maybe(List(E)) {
  induction (list) {
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
