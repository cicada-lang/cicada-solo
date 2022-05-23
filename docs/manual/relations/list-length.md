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

# map_keep_list_length

```cicada
// function map_keep_list_length()
```
