---
title: Inconsistency of fulfilling type
author: Xie Yuheng
date: 2021-11-11
---

We can apply a class like it is a function.

``` cicada
class C { T: Type, x: String }
```

Take `C` as an example,  the type of `C` is `Type`:

``` cicada
C
```

``` cicada output
class {
  T: Type
  x: String
}: Type
```

But we can also use `C` as a `(Type) -> Type`:

``` cicada
C(String)
```

``` cicada output
class {
  T: Type = String
  x: String
}: Type
```

And we can also use `C` as a `(Type, String) -> Type`:


``` cicada
C(String, "a")
```

``` cicada output
class {
  T: Type = String
  x: String = "a"
}: Type
```

This is an inconsistency of current design of fulfilling type.

The function application syntax is overloaded,
leading a reader to think that `C` has type `(Type) -> Type` or `(Type, String) -> Type`.
