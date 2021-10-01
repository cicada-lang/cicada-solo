# suger for not repeating argument list

This is a C language family syntax suger.

``` cicada
id1(A: Type, x: A): A {
  x
}

id2: (A: Type, x: A) -> A =
  (A, x) => x


id3: (A: Type, x: A) -> A =
  // NOTE The scope is different,
  //   thus the name of bound variables
  //   does not need to be the same.
  (B, y) => y


id1(Nat, 1)
id2(Nat, 1)
id3(Nat, 1)
```

# suger for multi-argument function

We can write both `(x, y)` and `(x) (y)` for function of two arguments.

``` cicada
f: (Trivial) -> (Trivial) -> Trivial =
  (x, y) => sole

f
f(sole)
f(sole, sole)

g: (Trivial) -> (Trivial) -> Trivial =
  (x) => (y) => sole


g
g(sole)
g(sole, sole)
```
