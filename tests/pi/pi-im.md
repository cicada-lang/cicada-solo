# pi type with implicit argument and implicit function insertion

Let's write the identity function with implicit type argument.

- `id1` is the same as `id2`, just in different syntax.
- for `id1` and `id2`, an implicit function will be inserted to get `id3`.

``` cicada
id1({ A: Type }, x: A): A {
  x
}

id2: ({ A: Type }, x: A) -> A =
  (x) {
    x
  }

id3: ({ A: Type }, x: A) -> A =
  (implicit { A }, x) {
    x
  }

id1
id2
id3

id1(implicit { A: Nat }, 1)
id2(implicit { A: Nat }, 1)
id3(implicit { A: Nat }, 1)
```

# return implicit value

``` cicada
typeof({ T: Type }, T): Type {
  T
}

typeof(123)
typeof("abc")
```

# multiple implicit arguments

``` cicada
k(
  { A: Type }, x: A,
  { B: Type }, y: B,
): A {
  x
}

k(implicit { A: Nat }, 100, implicit { A: Nat }, 101)
k(100, 101)
```

# do *not* support implicit argument over implicit argument

``` cicada counterexample
k(
  { A: Type },
  { B: Type },
  x: A,
  y: B,
): A {
  x
}
```

# do *not* support implicit argument over one argument

``` cicada counterexample
k(
  { A: Type },
  Trivial,
  x: A,
): A {
  x
}
```
