---
section: Basic
title: Built-in Types
---

# Type

`Type` is a `Type`.

``` cicada
Type
```

We can use `check! <exp>: <type>`,
to make assertion about an expression's type.

``` cicada
check! Type: Type
```

Don't forget that code blocks on our website are interactive,
hovering over them to see a menu button.

# String

`String` is a `Type`.

``` cicada
String

check! String: Type
```

We use double-quoted `String`.

``` cicada
"Hello, World!"

check! "Hello, World!": String
```

We can use `let` to do assignment.

``` cicada
let xyh = "Xie Yuheng"

xyh
```

# Trivial

`Trivial` is a `Type`, and `sole` is its only element.

``` cicada
check! Trivial: Type
check! sole: Trivial
```

`let` can be nested in `{ ...; return ... }`.

``` cicada
let result = {
  let x = sole
  return x
}

result
```

# Pair

`Pair` taken two `Type`, is a `Type`.

``` cicada
check! Pair(String, Trivial): Type
```

We can use `cons` to construct `Pair`.

``` cicada
check! cons("abc", sole): Pair(String, Trivial)
```

Writing `cons(<exp>, <exp>)` is the same as `[<exp> | <exp>]`.

``` cicada
check! ["abc" | sole]: Pair(String, Trivial)
```

We can write nested `Pair`.

``` cicada
check! Pair(Type, Pair(String, Trivial)): Type
check! [String | ["abc" | sole]]: Pair(Type, Pair(String, Trivial))
```

We can use `same_as_chart!` to assert that
many expressions of a given type are the same.

For example, the following four expressions in `[ ... ]`,
are different ways for writing the same thing.

``` cicada
same_as_chart! (Pair(Type, Pair(String, Trivial))) [
  [String, "abc" | sole],
  [String | ["abc" | sole]],
  cons(String, ["abc" | sole]),
  cons(String, cons("abc", sole)),
]
```

# Sigma

We write `Sigma` type as `[x: A | C]`,
where `x` might occur in `C`, or say, `C` depends on `x`.

This is why `Sigma` is called **dependent pair type**.

For `Pair` the second type is fixed,
while for `Sigma` the second type can change,
when first expression is different.

``` cicada
check! [x: Pair(Type, Type) | car(x)]: Type

check! [cons(String, Trivial) | "ABC"]: [x: Pair(Type, Type) | car(x)]
check! [cons(Trivial, String) | sole]: [x: Pair(Type, Type) | car(x)]
```

`Pair` is actually a special form of `Sigma`.
The following two types are the same.

``` cicada
same_as_chart! (Type) [
  Pair(String, Trivial),
  [_: String | Trivial],
]
```

# Pi
