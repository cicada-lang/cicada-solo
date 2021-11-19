# implicit argument insertion when applying implicit function

``` cicada
id(implicit A: Type, x: A): A {
  x
}

id(1)
id("a")
```

# multiple implicit arguments

``` cicada
k(
  implicit A: Type, x: A,
  implicit B: Type, y: B,
): A {
  x
}

k(100, 101)
```
