# implicit argument insertion when applying implicit function

``` cicada todo
id(implicit { A: Type }, x: A): A {
  x
}

id(1)
id(implicit { A: Nat }, 1)

id("a")
id(implicit { A: String }, "a")
```

# multiple implicit arguments

``` cicada todo
k(
  implicit { A: Type }, x: A,
  implicit { B: Type }, y: B,
): A {
  x
}

k(100, 101)
k(implicit { A: Nat }, 100, implicit { A: Nat }, 101)
```
