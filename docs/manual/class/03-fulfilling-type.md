---
section: Class
title: Fulfilling Type
---

> **Works on this chapter is not finished yet.**

``` cicada todo
class ABC { a: Type, b: a, c: String }

check! ABC: Type
check! ABC(Trivial): Type
check! ABC(Trivial, sole): Type
check! ABC(Trivial, sole, "c"): Type

// ABC :> ABC(Trivial) :> ABC(Trivial, sole) :> ABC(Trivial, sole, "c")

let abc: ABC(Trivial, sole) = {
  a: Trivial, b: sole, c: "c"
}

abc

abc.a
abc.b
abc.c

let fulled: ABC(Trivial, sole, "c") = {
  a: Trivial, b: sole, c: "c"
}

fulled

fulled.a
fulled.b
fulled.c
```

# Prefilled Class

``` cicada todo
class ABC { a: Type = Trivial, b: a, c: String }

let abc: ABC(Trivial, sole) = {
  a: Trivial,
  b: sole,
  c: "c",
}

abc

abc.a
abc.b
abc.c


class ABCDE {
  a: Type
  b: a
  c: String = "c"
  d: String
  e: String
}

let abcde: ABCDE(Trivial, sole, "c") = {
  a: Trivial,
  b: sole,
  c: "c",
  d: "d",
  e: "e",
}

abcde

abcde.a
abcde.b
abcde.c
abcde.d
abcde.e
```
