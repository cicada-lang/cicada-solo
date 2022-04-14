---
section: Implicit & Vague
title: Vague Function
---

# List

```cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

# vague-fn insertion -- on implicit-fn

```cicada
check (
  vague A,
  vague B,
  vague C,
  implicit T,
  x,
) => cons(List.null, cons(List.null, cons(List.null, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check (
  vague A,
  vague B,
  implicit T,
  x,
) => cons(List.null, cons(List.null, cons(List.null, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check (
  vague A,
  implicit T,
  x,
) => cons(List.null, cons(List.null, cons(List.null, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))

check (
  implicit T,
  x,
) => cons(List.null, cons(List.null, cons(List.null, T))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  implicit T: Type,
  x: T,
) -> Pair(List(A), Pair(List(B), Pair(List(C), Type)))
```

# vague-fn insertion -- on sigma

```cicada
check (
  vague A,
  vague B,
  vague C,
  vague D,
) => cons(List.null, cons(List.null, cons(List.null, List.null))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check (
  vague A,
  vague B,
  vague C,
) => cons(List.null, cons(List.null, cons(List.null, List.null))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check (
  vague A,
  vague B,
) => cons(List.null, cons(List.null, cons(List.null, List.null))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check (
  vague A,
) => cons(List.null, cons(List.null, cons(List.null, List.null))) : (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))

check cons(List.null, cons(List.null, cons(List.null, List.null))): (
  vague A: Type,
  vague B: Type,
  vague C: Type,
  vague D: Type,
) -> Pair(List(A), Pair(List(B), Pair(List(C), List(D))))
```
