# pi type with implicit argument and implicit function insertion

Let's write the identity function with implicit type argument.

- `id1` is the same as `id2`, just in different syntax.
- for `id1` and `id2`, an implicit function will be inserted to get `id3`.

``` cicada
id1(implicit A: Type, x: A): A {
  x
}

id2: (implicit A: Type, x: A) -> A = (x) => x
id3: (implicit A: Type, x: A) -> A = (implicit A, x) => x

id1
id2
id3

id1(1)
id2(1)
id3(1)
```

# return implicit value

``` cicada
typeof(implicit T: Type, T): Type {
  T
}

typeof(123)
typeof("abc")
```

# multiple implicit arguments

``` cicada
k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  x
}

k(100, 101)
```

# record of implicit arguments

``` cicada
car_type_t = (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type

car_type_t

car_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  A
}

car_type

car_type_again: (
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
) -> Type = (implicit A, implicit B, pair) => A


car_type_again

car_type(is(cons(1, "a"), Pair(Nat, String)))
car_type_again(is(cons(1, "a"), Pair(Nat, String)))

// `cdr_type` -- only the idiomatic way:

cdr_type(
  implicit A: Type,
  implicit B: Type,
  pair: Pair(A, B),
): Type {
  B
}

cdr_type(is(cons(1, "a"), Pair(Nat, String)))
```

# do *not* support implicit argument over implicit argument

``` cicada counterexample
k(
  implicit A: Type,
  implicit B: Type,
  x: A,
  y: B,
): A {
  x
}
```

# do *not* support implicit argument over one argument

``` cicada counterexample
k(
  implicit A: Type,
  Trivial,
  x: A,
): A {
  x
}
```
