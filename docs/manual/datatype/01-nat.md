---
section: Datatype
title: Natural Number
---

We can use the `datatype` keyword to define new `datatype`s.

We take natural number as the first `datatype` example.

# Nat

``` cicada
datatype Nat {
  // `zero` is a `Nat`.
  zero: Nat
  // `add1` to previous `Nat` is `Nat`.
  add1(prev: Nat): Nat
}
```

After the definition, `Nat` is a `Type`.

``` cicada
check! Nat: Type
```

And we can use `Nat`'s constructors to construct `Nat`.

``` cicada
check! Nat.zero: Nat
check! Nat.add1: (Nat) -> Nat

check! Nat.add1(Nat.zero): Nat
check! Nat.add1(Nat.add1(Nat.zero)): Nat
```

We define some common natural numbers,
and use them to write tests in the following code.

``` cicada
let zero = Nat.zero
let one = Nat.add1(zero)
let two = Nat.add1(one)
let three = Nat.add1(two)
let four = Nat.add1(three)
let five = Nat.add1(four)
let six = Nat.add1(five)
let seven = Nat.add1(six)
let eight = Nat.add1(seven)
let nine = Nat.add1(eight)
let ten = Nat.add1(nine)
```

# add

We can use the `induction` keyword to define functions that operates over `Nat`.

`add` is one of the most basic function, it adds two `Nat`s togather.

``` cicada
function add(x: Nat, y: Nat): Nat {
  return induction (x) {
    // If `x` is `Nat.zero`,
    //   the result of `add` is simply `y`.
    case zero => y
    // If `x` is `Nat.add1(prev)`,
    //   the result of `add` is `add1` to `add(prev)`.
    case add1(_prev, almost) => Nat.add1(almost.prev)
  }
}
```

Note that,

- We did not recursively call `add(prev)`,
  but use `almost.prev` to get the result of the recursive call,

  - i.e. `almost.prev` is the same as `add(prev)`.

  - i.e. `induction` is like pattern matching,
    but an extra argument called `almost` is given to the caller,
    in which we can get the results of recursive calls.

- We often add a `_` prefix for a name taken from pattern matching,
  but not used in the following code.

  - `_prev` is a example of this situation.

Let's write some tests.

``` cicada
add(zero, zero)
add(zero, one)
add(one, zero)
add(one, one)
add(two, two)
```

Applying a function that takes two arguments to only one argument,
will return another function that takes one argument.

This is called **currying**.

``` cicada
check! add: (Nat, Nat) -> Nat
check! add(one): (Nat) -> Nat
check! add(one, one): Nat
```

We often use `same_as_chart!` to write test.

``` cicada
same_as_chart! (Nat) [
  add(two, three),
  add(three, two),
  five,
]
```

# About induction over Nat

By using `induction`, we are defining function using **recursive combinator**.

If we view `induction` over `Nat` as a function, it roughly has the following definition.

- The `motive` argument can be omitted (as we did), when the return type is simple.

``` cicada
function induction_nat(
  target: Nat,
  motive: (Nat) -> Type,
  case_of_zero: motive(Nat.zero),
  case_of_add1: (
    prev: Nat,
    almost: class { prev: motive(prev) },
  ) -> motive(Nat.add1(prev)),
): motive(target) {
  return induction (target) {
    motive
    case zero => case_of_zero
    case add1(prev, almost) => case_of_add1(prev, almost)
  }
}
```

# mul

After understood the definition of `add`,
we naturally want to define `mul`.

``` cicada
function mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => Nat.zero
    case add1(_prev, almost) => add(almost.prev, y)
  }
}
```

Let write some tests,
we use `{ ...; return ... }` to make the name `twelve`
only visible inside the following `{ ... }`.

``` cicada
{
  let twelve = add(ten, two)
  return same_as_chart! (Nat) [
    mul(four, three),
    mul(three, four),
    twelve,
  ]
}
```

# power_of & power

Next we define power function.

`power_of(x, y)` means `y` raised to the power of `x`.

``` cicada
function power_of(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(almost.prev, y)
  }
}
```

We swap the argument to get a more natural reading of the function.

`power(base, n)` means `base` raised to the power of `n`.

- We define `power_of` first,
  because its definition is similar to that of `add` and `mul`.

``` cicada
function power(base: Nat, n: Nat): Nat {
  return power_of(n, base)
}
```

Some tests.

``` cicada
same_as_chart! (Nat) [
  power(four, three),
  power_of(three, four),
  add(mul(six, ten), four),
]
```

# gauss

In primary school after the young Gauss misbehaved,
his teacher gave him a task: adding the numbers from 1 to 100.

`gauss(x)` calculates `0 + 1 + 2 + ... + x`,

``` cicada
function gauss(n: Nat): Nat {
  return induction (n) {
    case zero => Nat.zero
    case add1(prev, almost) => add(Nat.add1(prev), almost.prev)
  }
}
```

Tests.

``` cicada
same_as_chart! (Nat) [
  gauss(ten),
  add(mul(five, ten), five),
]
```

# factorial

`factorial(n)` calculates `n!`.

For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`.

Let's end this chapter with this famous function.

``` cicada
function factorial(n: Nat): Nat {
  return induction (n) {
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(Nat.add1(prev), almost.prev)
  }
}
```

Tests.

``` cicada
same_as_chart! (Nat) [
  factorial(five),
  add(mul(ten, ten), mul(two, ten))
]
```
