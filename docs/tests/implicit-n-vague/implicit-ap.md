---
section: Implicit & Vague
title: Implicit Application
---

# implicit argument insertion when applying implicit function

```cicada
function id(implicit A: Type, x: A): A {
  return x
}

compute id("a")
compute id(implicit String, "a")
```

# multiple implicit arguments

```cicada
function k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  return x
}

compute k(sole, "abc")
compute k(implicit Trivial, sole, "abc")
compute k(sole, implicit String, "abc")
compute k(implicit Trivial, sole, implicit String, "abc")
```
