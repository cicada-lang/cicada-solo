---
title: List Length
---

# ListLength

```cicada
import { List } from "../datatypes/list.md"
import { Nat } from "../datatypes/nat.md"
```

```cicada
datatype ListLength(E: Type) (list: List(E), length: Nat) {
  null_zero: ListLength(E, List.null, Nat.zero)
  cons_add1(
    head: E,
    tail: List(E),
    prev: Nat,
    tail_length: ListLength(E, tail, prev),
  ): ListLength(E, List.cons(head, tail), Nat.add1(prev))
}
```

```cicada
check ListLength.null_zero: ListLength(Trivial, List.null, Nat.zero)

check ListLength.cons_add1(
  sole,
  List.null,
  Nat.zero,
  ListLength.null_zero,
): ListLength(Trivial, List.cons(sole, List.null), Nat.add1(Nat.zero))
```

# map_keep_list_length

```cicada
import { map } from "../datatypes/list.md"

function map_keep_list_length(
  implicit E: Type,
  list: List(E),
  length: Nat,
  list_length: ListLength(E, list, length),
  implicit R: Type,
  f: (E) -> R,
): ListLength(R, map(list, f), length) {
  return induction (list_length) {
    motive (list, length, target) => ListLength(R, map(list, f), length)
    case null_zero => ListLength.null_zero
    case cons_add1(head, tail, prev, _tail_length, almost) =>
      ListLength.cons_add1(f(head), map(tail, f), prev, almost.tail_length)
  }
}
```
