---
section: Implicit & Vague
title: Implicit Application
---

# implicit argument insertion when applying implicit function

```cicada
function id(implicit A: Type, x: A): A {
  return x
}

id("a")
id(implicit String, "a")
```

# multiple implicit arguments

```cicada
function k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  return x
}

k(sole, "abc")
k(implicit Trivial, sole, "abc")
k(sole, implicit String, "abc")
k(implicit Trivial, sole, implicit String, "abc")
```
