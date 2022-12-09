---
title: Import
---

# Import from relative path

We can use `import` to reference definitions in other files.

Thus one file can be viewed as a _module_ of definitions.

For example,

- The current file is located at `"/module/import.md"`,
- we can use relative path `"../datatypes/nat.md"`,
  to locate `"/module/database/nat.md"`,
- in which a `datatype` called `Nat` is defined
  (we will talk about `Nat` in the following chapters),
- and we import this definition.

```cicada
import { Nat } from "../datatypes/nat.md"

compute Nat.zero
compute Nat.add1(Nat.zero)
```

# Import from URL

Under some URLs, there are files.

We can even `import` from them.

Since the name `Nat` is already imported, and we can not redefine names.
We use `Nat as NatFromURL` to rename the imported definition.

```cicada todo
import {
  Nat as NatFromURL
} from "https://cdn.cicada-solo.cic.run/docs/manual/datatypes/nat.md"

compute NatFromURL.zero
compute NatFromURL.add1(NatFromURL.zero)
```
