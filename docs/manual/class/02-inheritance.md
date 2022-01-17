---
section: Class
title: Inheritance
---

> **Works on this chapter is not finished yet.**

``` cicada
class ABC {
  a: Type
  b: a
  c: String
}

class ABCEFG extends ABC {
  e: Type
  f: e
  g: String
}

let abcefg: ABCEFG = {
  a: Trivial,
  b: sole,
  c: "c",
  e: Trivial,
  f: sole,
  g: "g",
}

abcefg

abcefg.a
abcefg.b
abcefg.c
abcefg.e
abcefg.f
abcefg.g
```
