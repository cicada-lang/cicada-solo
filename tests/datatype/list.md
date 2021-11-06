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

``` cicada
length(implicit { E: Type }, x: List(E)): Nat {
  induction_list(
    E,
    (_) => Nat,
    0,
    (_head, _tail, almost) => add1(almost),
  ) (x)
}
```

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
same_as_chart! Nat [
  length(li! [1, 2, 3]),
  length(li! ["a", "b", "c"]),
  3,
]
```

# prepend & append

``` cicada
prepend(implicit { E: Type }, x: List(E)): (List(E)) -> List(E) {
  induction_list(
    E,
    (_) => List(E),
    x,
    (head, _tail, almost) => li(head, almost),
  )
}
```

``` cicada wishful-thinking
prepend(implicit { E: Type }, x: List(E)): (List(E)) -> List(E) {
  induction List(E) {
    (_) => List(E)
    case nil => x
    case li(head, _tail, almost) => List.li(head, almost.tail)
  }
}
```

``` cicada
append(implicit { E: Type }, x: List(E), y: List(E)): List(E) {
  prepend(y, x)
}
```

``` cicada
same_as_chart! List(Nat) [
  append(li! [1, 2, 3], li! [4, 5, 6]),
  li! [1, 2, 3, 4, 5, 6],
]
```

# reverse

``` cicada
li_end(E: Type, x: List(E), e: E): List(E) {
  list_rec(
    x,
    li(e, nil),
    (head, _tail, almost) => li(head, almost)
  )
}

li_end(Nat, li! [1, 2, 3], 4)

reverse_step(E: Type, head: E, _tail: List(E), almost: List(E)): List(E) {
  li_end(E, almost, head)
}

reverse(E: Type, x: List(E)): List(E) {
  list_rec(x, the(List(E), nil), reverse_step(E))
}
```

``` cicada wishful-thinking

```

``` cicada
same_as_chart! List(Nat) [
  reverse(Nat, li! [1, 2, 3]),
  li! [3, 2, 1],
]
```
