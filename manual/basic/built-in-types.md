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

`let` can be nested in `{ ...; return ... }`.

``` cicada
let yh = {
  let name = "Yuheng"
  return name
}

yh
```

# Trivial

`Trivial` is a `Type`, and `sole` is its only element.

``` cicada
check! Trivial: Type
check! sole: Trivial
```
