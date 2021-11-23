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

``` cicada
datatype MyList(E: Type) {
  my_null: MyList(E)
  my_cons(head: E, tail: MyList(E)): MyList(E)
}

check! MyList: (Type) -> Type
check! MyList(Nat): Type

// check! MyList::my_null: MyList(Nat)
// check! MyList::my_cons(1, MyList::my_null): MyList(Nat)
```

# induction List

``` cicada
function induction_list(
  implicit E: Type,
  target: List(E),
  motive: (List(E)) -> Type,
  case_nil: motive(nil),
  case_li: (
    head: E, tail: List(E),
    almost_on_tail: motive(tail),
  ) -> motive(li(head, tail)),
): motive(target) {
  return list_ind(target, motive, case_nil, case_li)
}
```

# length

``` cicada
function length(implicit E: Type, x: List(E)): Nat {
  return induction_list(
    x,
    (_) => Nat,
    0,
    (_head, _tail, almost) => add1(almost),
  )
}
```

``` cicada wishful-thinking
function length(implicit E: Type, x: List(E)): Nat {
  return induction (x) {
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

# append


``` cicada
function append(implicit E: Type, x: List(E), y: List(E)): List(E) {
  return induction_list(
    x,
    (_) => List(E),
    y,
    (head, _tail, almost) => li(head, almost),
  )
}
```

``` cicada wishful-thinking
function append(implicit E: Type, x: List(E), y: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case nil => y
    case li(head, _tail, almost) => List.li(head, almost.tail)
  }
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
function li_end(implicit E: Type, e: E, x: List(E)): List(E) {
  return induction_list(
    x,
    (_) => List(E),
    li(e, nil),
    (head, _tail, almost) => li(head, almost)
  )
}

function reverse(implicit E: Type, x: List(E)): List(E) {
  return induction_list(
    x,
    (_) => List(E),
    nil,
    (head, _tail, almost) => li_end(head, almost),
  )
}
```

``` cicada wishful-thinking
function li_end(implicit E: Type, e: E, x: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case nil => List.li(e, nil)
    case li(head, _tail, almost) => List.li(head, almost.tail)
  }
}

function reverse(implicit E: Type, x: List(E)): List(E) {
  return induction (x) {
    (_) => List(E)
    case nil => List.nil
    case li(head, _tail, almost) => li_end(head, almost.tail)
  }
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
