---
title: List
---

# List

``` cicada wishful-thinking
datatype List(E: Type) {
  nil: List(E)
  li(head: E, tail: List(E)): List(E)
}
```

# induction List

``` cicada
induction_list(
  E: Type,
  motive: (List(E)) -> Type,
  case_nil: motive(nil),
  case_li: (
    head: E, tail: List(E),
    almost_on_tail: motive(tail),
  ) -> motive(li(head, tail)),
  target: List(E),
): motive(target) {
  list_ind(target, motive, case_nil, case_li)
}
```

# length

``` cicada wishful-thinking
length(E: Type): (List(E)) -> Nat {
  induction List(E) {
    (_) => Nat
    case nil => 0
    case li(_head, _tail, almost) => Nat.add1(almost.tail)
  }
}
```

``` cicada
length(E: Type): (List(E)) -> Nat {
  induction_list(
    E,
    (_) => Nat,
    0,
    (_head, _tail, almost) => add1(almost),
  )
}
```

``` cicada
same_as_chart! Nat [
  length(Nat, li! [1, 2, 3]),
  length(String, li! ["a", "b", "c"]),
  3,
]
```
