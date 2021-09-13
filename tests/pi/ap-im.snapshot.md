# implicit argument insertion when applying implicit function

``` cicada
id(given A: Type, x: A): A {
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
  given A: Type, x: A,
  given B: Type, y: B,
): A {
  x
}

k(100, 101)
k(given Nat, 100, given Nat, 101)
```
