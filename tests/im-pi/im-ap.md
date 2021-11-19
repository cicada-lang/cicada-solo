# implicit argument insertion when applying implicit function

``` cicada
id(implicit A: Type, x: A): A {
  x
}

id(1)
id(implicit Nat, 1)

id("a")
id(implicit String, "a")
```

# multiple implicit arguments

``` cicada
k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  x
}

k(123, "abc")
k(implicit Nat, 123, "abc")
k(123, implicit String, "abc")
k(implicit Nat, 123, implicit String, "abc")
```
