---
title: Implicit Arguments
---

To explain the use of **implicit arguments**,
let's define a function that takes an argument
and simply returns it, without doing anything.

Wait a second!

It seems, in the chapter [Built-in Types](../basic/built-in-types.md),
we already have a function just like this.

Remind the definition of `the`.

```cicada
function the(T: Type, x: T): T {
  return x
}
```

It takes a type and an argument of that type,
then simply returns the second argument.

```cicada
compute the(String, "abc")
compute the(Trivial, sole)
```

It already looks good, but there is one problem -- it takes two arguments.

Is it possible to take only one argument, like the original requirement?

This is where `implicit` can be helpful.

```cicada
function id(implicit T: Type, x: T): T {
  return x
}
```

Now `id` can be applied to one argument.

```cicada
compute id("abc")
compute id(sole)
```

# How it works?

First, implicit `Pi` type is a `Type`.

```cicada
compute (implicit T: Type, x: T) -> T
```

If we omit an implicit argument in a function application,
the type checker will infer the type of the next non-implicit argument,
and use this information to resolve the implicit argument, and insert it.

Suppose I am the type checker, when I see `id("abc")`,

1. I infer `id` to be `(implicit T: Type, x: T) -> T`;
2. I infer the argument `"abc"` to be `String`;
3. Now I know `T = String`;
4. I insert the implicit argument for `id("abc")`, to get `id(implicit String, "abc")`.

Thus the following expressions are the same.

```cicada
same_as_chart (String) [
  id("abc"),
  id(implicit String, "abc"),
]
```

# Using the implicit value

We can use the implicit value in function body.

An example would be a function that can return the type of its argument.

```cicada
function typeof(implicit T: Type, T): Type {
  return T
}

compute typeof("abc")  // String
compute typeof(sole)   // Trivial
```

# Multiple implicit arguments

We can use multiple implicit arguments to find the `car` type of a `Pair`.

```cicada
function car_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  return A
}

let pair: Pair(Trivial, String) = cons(sole, "a")

compute car_type(pair)  // Trivial
```

# Limits

We do _not_ support implicit argument over implicit argument.

**The following is a counterexample.**

```cicada counterexample
function k(
  implicit A: Type,
  implicit B: Type,
  x: A,
  y: B,
): A {
  return x
}
```

_Nor_ do we support implicit argument over one normal argument.

**The following is a counterexample.**

```cicada counterexample
function k(
  implicit A: Type,
  Trivial,
  x: A,
): A {
  return x
}
```
