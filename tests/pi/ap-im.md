# implicit argument insertion when applying implicit function

``` cicada
id({ A: Type }, x: A): A {
  x
}

id(1)
id(implicit { A: Nat }, 1)

id("a")
id(implicit { A: String }, "a")
```

# multiple implicit arguments

``` cicada
k(
  { A: Type }, x: A,
  { B: Type }, y: B,
): A {
  x
}

k(100, 101)
k(implicit { A: Nat }, 100, implicit { A: Nat }, 101)
```
