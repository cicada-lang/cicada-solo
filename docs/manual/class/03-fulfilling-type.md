---
title: Fulfilling Type
---

A class is a `Type`.

**Fulfilling type** means that,

> A partly fulfilled class is also a `Type`.

We can partly fulfill a class by apply it to arguments,
its fields will be fulfilled one by one.

```cicada
import { ABC } from "./01-class-n-object.md"

check ABC: Type

check ABC(Trivial): Type
check ABC(Trivial, sole): Type
check ABC(Trivial, sole, "c"): Type

check ABC(String): Type
check ABC(String, "b"): Type
check ABC(String, "b", "c"): Type
```

The object construction works as usual.

```cicada
check { a: Trivial, b: sole, c: "c" }: ABC(Trivial)
check { a: Trivial, b: sole, c: "c" }: ABC(Trivial, sole)
check { a: Trivial, b: sole, c: "c" }: ABC(Trivial, sole, "c")
```

**NOTE Subtyping is working in progress.**

For examples,

- `ABC(Trivial)` will be a subtype of `ABC`;
- `ABC(Trivial, sole)` will be a subtype of `ABC(Trivial)`.

# Prefilled Class

Except be fulfilled, a class can also be prefilled.

```cicada todo
class PrefilledABC {
  a: Type = Trivial,
  b: a,
  c: String,
}

check {
  a: Trivial,
  b: sole,
  c: "c",
}: PrefilledABC
```

Prefilled fields need not to be at the beginning.

```cicada
class PrefilledABCDE {
  a: Type
  b: a
  c: String = "c"
  d: String
  e: String
}

check {
  a: Trivial,
  b: sole,
  c: "c",
  d: "d",
  e: "e",
}: PrefilledABCDE
```

Prefilled class can also be fulfilled by applying the class to arguments,
note that the prefilled fields must be the same.

```cicada
check {
  a: Trivial,
  b: sole,
  c: "c",
  d: "d",
  e: "e",
}: PrefilledABCDE(Trivial, sole, "c")
```
