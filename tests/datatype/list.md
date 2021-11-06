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
li_end(implicit { E: Type }, e: E): (List(E)) -> List(E) {
  induction_list(
    E,
    (_) => List(E),
    li(e, nil),
    (head, _tail, almost) => li(head, almost)
  )
}

reverse(implicit { E: Type }, x: List(E)): List(E) {
  induction_list(
    E,
    (_) => List(E),
    nil,
    (head, _tail, almost) => li_end(head, almost),
  ) (x)
}
```

``` cicada wishful-thinking
li_end(implicit { E: Type }, e: E): (List(E)) -> List(E) {
  induction List(E) {
    (_) => List(E)
    case nil => List.li(e, nil)
    case li(head, _tail, almost) => List.li(head, almost.tail)
  }
}

reverse(implicit { E: Type }, x: List(E)): List(E) {
  induction List(E) {
    (_) => List(E)
    case nil => List.nil
    case (head, _tail, almost) => li_end(head, almost.tail)
  } (x)
}
```

``` cicada
same_as_chart! List(Nat) [
  li_end(4, li! [1, 2, 3]),
  li! [1, 2, 3, 4]
]

same_as_chart! List(Nat) [
  reverse(li! [1, 2, 3]),
  li! [3, 2, 1],
]
```
