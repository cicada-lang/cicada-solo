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
