---
section: Class
title: Inheritance
---

We can combine `class` and `extends`
to extend an existing `class`.

```cicada
import { ABC } from "./01-class-n-object.md"

class ABCEFG extends ABC {
  e: Type
  f: e
  g: String
}
```

If feels like the fields of the extension
is merged into the fields of `ABC`.

Object construction works as usual.

```cicada
let abcefg: ABCEFG = {
  a: Trivial,
  b: sole,
  c: "c",
  e: Trivial,
  f: sole,
  g: "g",
}
```

So does the **dot notation**.

```cicada
compute abcefg.a
compute abcefg.b
compute abcefg.c
compute abcefg.e
compute abcefg.f
compute abcefg.g
```
