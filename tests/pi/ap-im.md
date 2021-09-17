# implicit argument insertion when applying implicit function

``` cicada
id({ A: Type }, x: A): A {
  x
}

id(1)
id(given Nat, 1)

id("a")
id(given String, "a")
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
k(given Nat, 100, given Nat, 101)
```
