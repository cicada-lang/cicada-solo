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

We can use `let <name> = <exp>` to do assignment.

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
  let y = x
  let z = y
  return z
}

result
```

# Pair (Both)

`Pair` taken two `Type`s, is a `Type`.

``` cicada
check! Pair(String, Trivial): Type
```

We can use `cons` to construct `Pair`.

``` cicada
check! cons("abc", sole): Pair(String, Trivial)
```

And using `car` take a `Pair`'s first element,
using `cdr` to take a `Pair`'s second element.

``` cicada
let pair: Pair(String, Trivial) = cons("abc", sole)

check! car(pair): String
check! cdr(pair): Trivial
```

We use `Both` as another name of `Pair`,
because we read `Pair(A, C)` as

> Both A and C are true.

The following two expressions are the same `Type`.

``` cicada
Pair(String, Trivial)
Both(String, Trivial)
```

Writing `cons(<exp>, <exp>)` is the same as writing `[<exp> | <exp>]`.

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

We read `[x: A | C]` as

> There exists `x` in `A`, such that `C` is true.

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

# Function

We write function as `(A) -> R`,
where `A` is the argument type,
and `R` is the return type.

``` cicada
check! (String) -> Trivial: Type
check! (Pair(String, Trivial)) -> Pair(Trivial, String): Type
```

We use `(x) => ...` to construct **anonymous function**,
which is also famously called **lambda**.

``` cicada
check! (x) => sole: (String) -> Trivial
check! (pair) => cons(cdr(pair), car(pair)): (Pair(String, Trivial)) -> Pair(Trivial, String)
```

We can use `let <name>: <type> = <exp>` to give an anonymous function a name.

``` cicada
let very_trivial: (String) -> Trivial = (x) => sole

check! very_trivial("any string"): Trivial
```

We can also use `function` to define a function.

``` cicada
function swap_pair(
  pair: Pair(String, Trivial)
): Pair(Trivial, String) {
  return cons(cdr(pair), car(pair))
}

check! pair: Pair(String, Trivial)
check! swap_pair(pair): Pair(Trivial, String)
```

# Pi

We write `Pi` type as `(x: A) -> R`,
where `x` might occur in `R`, or say, `R` depends on `x`.

This is why `Pi` is called **dependent function type**.

We read `(x: A) -> R` as

> For all `x` in `A`, `R` is true.

For function type the return type is fixed,
while for `Pi` the return type can change,
when the argument expression is different.

``` cicada
check! (T: Type) -> (T) -> T: Type
```

The return type of the about `Pi` is `(T) -> T`,
it depends on the argument expression `T`.

We have a built-in function of the above type,
and we call this function `the`.

``` cicada
the(String, "abc")
the(Trivial, sole)
the((T: Type) -> (T) -> T, the)
```

It is defined as the following:

``` cicada
function the(T: Type, x: T): T {
  return x
}
```

# Absurd

`Absurd` is a very special `Type`, because it has no elements.

``` cicada
check! Absurd: Type
```

We have a built-in function called `from_falsehood_anything`,
if you have a element of type `Absurd`,
you can use it to prove anything.

``` cicada
check! from_falsehood_anything: (target: Absurd, motive: Type) -> motive
```
