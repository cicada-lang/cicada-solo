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
    case add1(prev, almost) => Nat.add1(almost.prev)
  }
}
```

Note that, we did not recursively call `add(prev)`,
but use `almost.prev` to get the result of the recursive call.

- i.e. `almost.prev` is the same as `add(prev)`

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
check! add(one)(one): Nat
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

``` cicada
function mul(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => Nat.zero
    case add1(_prev, almost) => add(almost.prev, y)
  }
}
```

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

``` cicada
function power_of(x: Nat, y: Nat): Nat {
  return induction (x) {
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(almost.prev, y)
  }
}
```

``` cicada
function power(base: Nat, n: Nat): Nat {
  return power_of(n, base)
}
```

``` cicada
same_as_chart! (Nat) [
  power(four, three),
  power_of(three, four),
  add(mul(six, ten), four),
]
```

# gauss

``` cicada
function gauss(x: Nat): Nat {
  return induction (x) {
    case zero => Nat.zero
    case add1(prev, almost) => add(Nat.add1(prev), almost.prev)
  }
}
```

``` cicada
same_as_chart! (Nat) [
  gauss(ten),
  add(mul(five, ten), five),
]
```

# factorial

``` cicada
function factorial(x: Nat): Nat {
  return induction (x) {
    case zero => Nat.add1(Nat.zero)
    case add1(prev, almost) => mul(Nat.add1(prev), almost.prev)
  }
}
```

``` cicada
same_as_chart! (Nat) [
  factorial(five),
  add(mul(ten, ten), mul(two, ten))
]
```

# add_commute

## equal_map

``` cicada
function equal_map(
  implicit X: Type,
  implicit from: X,
  implicit to: X,
  target: Equal(X, from, to),
  implicit Y: Type,
  f: (X) -> Y,
): Equal(Y, f(from), f(to)) {
  return replace(
    target,
    (x) => Equal(Y, f(from), f(x)),
    refl,
  )
}
```

## equal_swap

``` cicada
function equal_swap(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  xy_equal: Equal(A, x, y),
): Equal(A, y, x) {
  return replace(
    xy_equal,
    (w) => Equal(A, w, x),
    refl,
  )
}
```

## equal_compose

``` cicada
function equal_compose(
  implicit A: Type,
  implicit x: A,
  implicit y: A,
  xy_equal: Equal(A, x, y),
  implicit z: A,
  yz_equal: Equal(A, y, z),
): Equal(A, x, z) {
  return replace(
    yz_equal,
    (w) => Equal(A, x, w),
    xy_equal,
  )
}
```

## add_zero_commute

``` cicada
function add_zero_commute(
  x: Nat
): Equal(Nat, add(zero, x), add(x, zero)) {
  return induction (x) {
    (x) => Equal(Nat, add(zero, x), add(x, zero))
    case zero => refl
    case add1(prev, almost) => equal_map(almost.prev, Nat.add1)
  }
}
```

## add_add1_commute

``` cicada
function add_add1_commute(
  x: Nat, y: Nat,
): Equal(Nat, add(x, Nat.add1(y)), Nat.add1(add(x, y))) {
  return induction (x) {
    (x) => Equal(Nat, add(x, Nat.add1(y)), Nat.add1(add(x, y)))
    case zero => refl
    case add1(prev, almost) => equal_map(almost.prev, Nat.add1)
  }
}
```

## add_commute

``` cicada
function add_commute(
  x: Nat, y: Nat,
): Equal(Nat, add(x, y), add(y, x)) {
  return induction (x) {
    (x) => Equal(Nat, add(x, y), add(y, x))
    case zero => add_zero_commute(y)
    case add1(prev, almost) =>
      equal_compose(
        equal_map(almost.prev, Nat.add1),
        equal_swap(add_add1_commute(y, prev)),
      )
  }
}

add_commute(two, three)
add_commute(three, two)
```
