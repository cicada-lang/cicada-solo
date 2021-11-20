# sugar for not repeating argument list

This is a C language family syntax sugar.

``` cicada
function id1(A: Type, x: A): A {
  return x
}

let id2: (A: Type, x: A) -> A =
  (A, x) => x

let id3: (A: Type, x: A) -> A =
  // NOTE The scope is different,
  //   thus the name of bound variables
  //   does not need to be the same.
  (B, y) => y

id1(Nat, 1)
id2(Nat, 1)
id3(Nat, 1)
```

# sugar for multi-argument function

We can write both `(x, y) => ...` and `(x) => (y) => ...` for function of two arguments.

``` cicada
let f: (Trivial) -> (Trivial) -> Trivial =
  (x, y) => sole

f
f(sole)
f(sole, sole)

let g: (Trivial) -> (Trivial) -> Trivial =
  (x) => (y) => sole

g
g(sole)
g(sole, sole)
```
