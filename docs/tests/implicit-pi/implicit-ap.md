# implicit argument insertion when applying implicit function

``` cicada
function id(implicit A: Type, x: A): A {
  return x
}

id(1)
id(implicit Nat, 1)

id("a")
id(implicit String, "a")
```

# multiple implicit arguments

``` cicada
function k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  return x
}

k(123, "abc")
k(implicit Nat, 123, "abc")
k(123, implicit String, "abc")
k(implicit Nat, 123, implicit String, "abc")
```
