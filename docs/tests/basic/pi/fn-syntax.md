# sugar for not repeating argument list

This is a C language family syntax sugar.

```cicada
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

compute id1(String, "a")
compute id2(String, "a")
compute id3(String, "a")
```

# sugar for multi-argument function

We can write both `(x, y) => ...` and `(x) => (y) => ...` for function of two arguments.

```cicada
let f: (Trivial) -> (Trivial) -> Trivial =
  (x, y) => sole

compute f
compute f(sole)
compute f(sole, sole)

let g: (Trivial) -> (Trivial) -> Trivial =
  (x) => (y) => sole

compute g
compute g(sole)
compute g(sole, sole)
```
