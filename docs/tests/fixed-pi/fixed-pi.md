# vector_null

``` cicada
function vector_null(fixed E: Type): Vector(E, 0) {
  return vecnil
}

vector_null
check! vector_null: (fixed E: Type) -> Vector(E, 0)
// check! vector_null: Vector(String, 0)
```

# my_list_cons

``` cicada
function my_list_cons(fixed E: Type, head: E, tail: List(E)): List(E) {
  return li(head, tail)
}

my_list_cons

check! my_list_cons: (fixed E: Type, head: E, tail: List(E)) -> List(E)
// check! my_list_cons("a"): (tail: List(String)) -> List(String)
// check! my_list_cons("a", nil): List(String)
```
