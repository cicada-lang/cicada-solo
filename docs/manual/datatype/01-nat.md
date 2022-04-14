---
section: Datatype
title: Natural Number
---

We can use the `datatype` keyword to define new `datatype`s.

We take natural number as the first `datatype` example.

# Nat

```cicada
datatype Nat {
  // `zero` is a `Nat`.
  zero: Nat
  // `add1` to previous `Nat` is `Nat`.
  add1(prev: Nat): Nat
}
```

After the definition, `Nat` is a `Type`.

```cicada
check Nat: Type
```

And we can use `Nat`'s constructors to construct `Nat`.

```cicada
check Nat.zero: Nat
check Nat.add1: (Nat) -> Nat

check Nat.add1(Nat.zero): Nat
check Nat.add1(Nat.add1(Nat.zero)): Nat
```

We define some common natural numbers,
and use them to write tests in the following code.

```cicada
let zero = Nat.zero
let add1 = Nat.add1

let one = add1(zero)
let two = add1(one)
let three = add1(two)
let four = add1(three)
let five = add1(four)
let six = add1(five)
let seven = add1(six)
let eight = add1(seven)
let nine = add1(eight)
let ten = add1(nine)
```

# add

We can use the `induction` keyword to define functions that operates over `Nat`.

`add` is one of the most basic function, it adds two `Nat`s togather.

```cicada
function add(x: Nat, y: Nat): Nat {
  return induction (x) {
    // If `x` is `zero`,
    //   the result of `add` is simply `y`.
    case zero => y
    // If `x` is `add1(prev)`,
    //   the result of `add` is `add1` to `add(prev)`.
    case add1(_prev, almost) => add1(almost.prev)
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

```cicada
add(zero, zero)
add(zero, one)
add(one, zero)
add(one, one)
add(two, two)
```

Applying a function that takes two arguments to only one argument,
will return another function that takes one argument.

This is called **currying**.

```cicada
check add: (Nat, Nat) -> Nat
check add(one): (Nat) -> Nat
check add(one, one): Nat
```

We often use `same_as_chart` to write test.

```cicada
same_as_chart (Nat) [
  add(two, three),
  add(three, two),
  five,
]
```

# About induction over Nat

By using `induction`, we are defining function using **recursive combinator**.

If we view `induction` over `Nat` as a function, it roughly has the following definition.

- The `motive` argument can be omitted (as we did), when the return type is simple.

```cicada
function induction_nat(
  target: Nat,
  motive: (Nat) -> Type,
  case_of_zero: motive(zero),
  case_of_add1: (
    prev: Nat,
    almost: class { prev: motive(prev) },
  ) -> motive(add1(prev)),
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

```cicada
function mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => zero
    case add1(_prev, almost) => add(almost.prev, y)
  }
}
```

Let write some tests,
we use `{ ...; return ... }` to make the name `twelve`
only visible inside the following `{ ... }`.

```cicada
{
  let twelve = add(ten, two)
  return same_as_chart (Nat) [
    mul(four, three),
    mul(three, four),
    twelve,
  ]
}
```

# power_of & power

Next we define power function.

`power_of(x, y)` means `y` raised to the power of `x`.

```cicada
function power_of(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => add1(zero)
    case add1(prev, almost) => mul(almost.prev, y)
  }
}
```

We swap the argument to get a more natural reading of the function.

`power(base, n)` means `base` raised to the power of `n`.

- We define `power_of` first,
  because its definition is similar to that of `add` and `mul`.

```cicada
function power(base: Nat, n: Nat): Nat {
  return power_of(n, base)
}
```

Some tests.

```cicada
same_as_chart (Nat) [
  power(four, three),
  power_of(three, four),
  add(mul(six, ten), four),
]
```

# gauss

In primary school after the young Gauss misbehaved,
his teacher gave him a task: adding the numbers from 1 to 100.

`gauss(x)` calculates `0 + 1 + 2 + ... + x`,

- Thanks, Carl Friedrich Gauss (1777 - 1855), you are the prince of mathematics!

```cicada
function gauss(n: Nat): Nat {
  return induction (n) {
    case zero => zero
    case add1(prev, almost) => add(add1(prev), almost.prev)
  }
}
```

Tests.

```cicada
same_as_chart (Nat) [
  gauss(ten),
  add(mul(five, ten), five),
]
```

# factorial

`factorial(n)` calculates `n!`.

For example, `5! = 5 * 4 * 3 * 2 * 1 = 120`.

Let's end this chapter with this famous function.

```cicada
function factorial(n: Nat): Nat {
  return induction (n) {
    case zero => add1(zero)
    case add1(prev, almost) => mul(add1(prev), almost.prev)
  }
}
```

Tests.

```cicada
same_as_chart (Nat) [
  factorial(five),
  add(mul(ten, ten), mul(two, ten))
]
```

# fibonacci

Actually, before we end this chapter,
let's define another very famous function -- the Fibonacci function.

- Thanks `u/hugogrant` for [asking about this example](https://www.reddit.com/r/ProgrammingLanguages/comments/s4crfg/comment/hsqgye6/?utm_source=share&utm_medium=web2x&context=3).

```plaintext
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2)
```

| 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0   | 1   | 1   | 2   | 3   | 5   | 8   | 13  | 21  | 34  | 55  |

We use an iterative process for computing the Fibonacci numbers.
The idea is to use a pair of integers `current` and `next`,
initialized `F(0) = 1` and `F(0) = 0`,
and to repeatedly apply the simultaneous transformations:

```plaintext
current <- next
next <- current + next
```

First, we define a helper function -- `fibonacci_iter`, for the iterative process.

```cicada
function fibonacci_iter(count: Nat): (current: Nat, next: Nat) -> Nat {
  return induction (count) {
    case zero =>
      (current, next) => current
    case add1(_prev, almost) =>
      (current, next) => almost.prev(next, add(current, next))
  }
}
```

Then we can define the `fibonacci` using `fibonacci_iter`.

```cicada
function fibonacci(n: Nat): Nat {
  return fibonacci_iter(n, zero, add1(zero))
}
```

Tests.

```cicada
fibonacci(zero)
fibonacci(one)
fibonacci(two)
fibonacci(three)
fibonacci(four)
fibonacci(five)
fibonacci(six)
```
