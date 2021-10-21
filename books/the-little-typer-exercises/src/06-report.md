---
title: 6. Precisely How Many?
date: 2021-05-06
---

# type check or infer error

`infer` error is described as "exp is not described by a type", for example:

```
What is the value of
  (first-of-one Atom vecnil)?

That question is meaningless because
  (first-of-one Atom vecnil)
is not described by a type, and this is
because
  vecnil
is not a
  (Vec Atom 1).
```

# Use a More Specific Type

Make a function total by using a more specific type to
rule out unwanted arguments.
