---
section: Implicit & Vague
title: Implicit Function
---

# The bound variable name of `im-fn` does not matter.

```cicada
function typeof(implicit T: Type, x: T): Type {
  return T
}

check! (implicit T, _) => T: (implicit T: Type, x: T) -> Type
check! (implicit A, _) => A: (implicit T: Type, x: T) -> Type

function typeof_pair(implicit A: Type, implicit B: Type, pair: Pair(A, B)): Pair(Type, Type) {
  return cons(A, B)
}

check! (implicit A, implicit B, _pair) => cons(A, B): (implicit A: Type, implicit B: Type, pair: Pair(A, B)) -> Pair(Type, Type)
check! (implicit X, implicit Y, _pair) => cons(X, Y): (implicit A: Type, implicit B: Type, pair: Pair(A, B)) -> Pair(Type, Type)

function typeof_triple(
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  triple: Pair(A, Pair(B, C)),
): Pair(Type, Pair(Type, Type)) {
  return cons(A, cons(B, C))
}

check! (implicit A, implicit B, implicit C, _pair) => cons(A, cons(B, C)): (implicit A: Type, implicit B: Type, implicit C: Type, triple: Pair(A, Pair(B, C))) -> Pair(Type, Pair(Type, Type))
check! (implicit X, implicit Y, implicit Z, _pair) => cons(X, cons(Y, Z)): (implicit A: Type, implicit B: Type, implicit C: Type, triple: Pair(A, Pair(B, C))) -> Pair(Type, Pair(Type, Type))
```

# insert im-fn on im-fn

## pick_second_type

```cicada
function pick_second_type(
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
): Type {
  return B
}

pick_second_type

check! (
  implicit A,
  implicit B,
  implicit C,
  implicit D,
  triple,
) => B : (
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
) -> Type

check! (
  implicit A,
  implicit B,
  implicit C,
  triple,
) => B : (
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
) -> Type

check! (
  implicit A,
  implicit B,
  triple,
) => B : (
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
) -> Type
```

## pick_third_type

```cicada
function pick_third_type(
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
): Type {
  return C
}

pick_third_type

check! (
  implicit A,
  implicit B,
  implicit C,
  implicit D,
  triple,
) => C : (
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
) -> Type

check! (
  implicit A,
  implicit B,
  implicit C,
  triple,
) => C : (
  implicit A: Type,
  implicit B: Type,
  implicit C: Type,
  implicit D: Type,
  target: Pair(A, Pair(B, Pair(C, D))),
) -> Type
```
