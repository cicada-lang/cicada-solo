---
section: Module
title: Import
---

# Import from relative path

We can use `import` to reference definitions in other files.

Thus one file can be viewed as a `Module` of definitions.

For example,

- current file is located at `"/module/01-import.md"`,
- we can use relative path `"../datatype/01-nat.md"`,
  to locate `"/module/database/01-nat.md"`,
- in which a `datatype` called `Nat` is defined
  (we will talk about `Nat` in the following chapters),
- and we import this definition.

```cicada
import { Nat } from "../datatype/01-nat.md"

compute Nat.zero
compute Nat.add1(Nat.zero)
```

# Import from URL

Under some URLs, there are files.

We can even `import` from them.

Since the name `Nat` is already imported, and we can not redefine names.
We use `Nat: NatFromURL` to rename the imported definition.

```cicada
import {
  Nat as NatFromURL
} from "https://readonly.link/files/cicada-lang/cicada/-/docs/manual/datatype/01-nat.md"

compute NatFromURL.zero
compute NatFromURL.add1(NatFromURL.zero)
```
