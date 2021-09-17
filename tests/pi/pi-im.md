# pi type with implicit argument and implicit function insertion

Let's write the identity function with implicit type argument.

- `id1` is the same as `id2`, just in different syntax.
- for `id1` and `id2`, an implicit function will be inserted to get `id3`.

``` cicada
id1(given A: Type, x: A): A {
  x
}

id2: (given A: Type, x: A) -> A =
  (x) {
    x
  }

id3: (given A: Type, x: A) -> A =
  (given A, x) {
    x
  }

id1
id2
id3

id1(given Nat, 1)
id2(given Nat, 1)
id3(given Nat, 1)
```

# multiple implicit arguments

``` cicada
k1(
  given A: Type, x: A,
  given B: Type, y: B,
): A {
  x
}

k1(given Nat, 100, given Nat, 101)
k1(100, 101)
```

# implicit argument over one argument

``` cicada
k_trivial(given A: Type, Trivial, x: A): A { x }
k_trivial(given Nat, sole, 123)
// TODO
// k_trivial(sole, 123)
```

# implicit argument over implicit argument

``` cicada
k2_t = (
  given A: Type,
  given B: Type,
  x: A,
  y: B,
) -> A

k2_t

k2(
  given A: Type,
  given B: Type,
  x: A,
  y: B,
): A {
  x
}

k2(given Nat, given Nat, 100, 101)
// TODO
// k2(100, 101)

// NOTE Test implicit fn insertion

k2_again: k2_t =
  (x, y) {
    x
  }

k2_again(given Nat, given Nat, 100, 101)
// TODO
// k2_again(100, 101)
```
