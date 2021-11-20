---
title: Inconsistency of fulfilling type
author: Xie Yuheng
date: 2021-11-11
---

We can apply a class like it is a function.

``` cicada
class C { T: Type, x: Nat }
```

Take `C` as an example,  the type of `C` is `Type`:

``` cicada
C
```

``` cicada output
class {
  T: Type
  x: Nat
}: Type
```

But we can also use `C` as a `(Type) -> Type`:

``` cicada
C(String)
```

``` cicada output
class {
  T: Type = String
  x: Nat
}: Type
```

And we can also use `C` as a `(Type, Nat) -> Type`:


``` cicada
C(String, 1)
```

``` cicada output
class {
  T: Type = String
  x: Nat = 1
}: Type
```

This is an inconsistency of current design of fulfilling type.

The function application syntax is overloaded,
leading a reader to think that `C` has type `(Type) -> Type` or `(Type, Nat) -> Type`.
