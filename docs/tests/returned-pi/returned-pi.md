# my_list_null

``` cicada
function my_list_null(returned A: Type): List(A) {
  return nil
}

check! my_list_null(returned Nat): List(Nat)

// NOTE zero-arity returned application
check! my_list_null: List(Nat)
check! my_list_null: List(String)
```

# my_list_cons

``` cicada
function my_list_cons(returned A: Type, head: A, tail: List(A)): List(A) {
  return li(head, tail)
}

check! my_list_cons(returned Nat, 123, nil): List(Nat)
check! my_list_cons(returned Nat): (Nat, List(Nat)) -> List(Nat)
check! my_list_cons(returned Nat)(123, nil): List(Nat)

check! my_list_cons(123, nil): List(Nat)
check! my_list_cons("a", nil): List(String)
check! my_list_cons("a", my_list_cons("b", nil)): List(String)
check! my_list_cons("a", my_list_cons("b", my_list_cons("c", nil))): List(String)
```

# my_list_null_pair

``` cicada
function my_list_null_pair(returned A: Type, returned B: Type): Pair(List(A), List(B)) {
  return cons(nil, nil)
}

check! my_list_null_pair(returned Nat, returned String): Pair(List(Nat), List(String))
check! my_list_null_pair(returned Nat)(returned String): Pair(List(Nat), List(String))

// NOTE zero-arity and nested returned application
check! my_list_null_pair: Pair(List(Nat), List(String))
check! my_list_null_pair: Pair(List(String), List(Nat))

// NOTE start inserting returned application from the first non-`returned` argument
// - this behavior is the same as the behavior of `implicit`
check! my_list_null_pair(returned String): Pair(List(String), List(Nat))

// NOTE if the given type is also a returned pi, we can also handle it,
//   because we try each possible case during unification.
check! my_list_null_pair: Pair(List(Nat), List(String))
check! my_list_null_pair: (returned B: Type) -> Pair(List(Nat), List(B))
check! my_list_null_pair: (returned A: Type, returned B: Type) -> Pair(List(A), List(B))
check! my_list_null_pair(returned String): Pair(List(String), List(Nat))
check! my_list_null_pair(returned String): (returned B: Type) -> Pair(List(String), List(B))
```

# my_list_null_and_typeof_pair

``` cicada
function my_list_null_and_typeof_pair(
  returned A: Type,
  implicit T: Type,
  x: T,
): Pair(List(A), Type) {
  return cons(nil, T)
}

check! my_list_null_and_typeof_pair(123): Pair(List(String), Type)
check! my_list_null_and_typeof_pair(implicit Nat, 123): Pair(List(String), Type)

check! my_list_null_and_typeof_pair("abc"): Pair(List(String), Type)
check! my_list_null_and_typeof_pair(implicit String, "abc"): Pair(List(String), Type)
```

# my_list_cons_and_typeof_pair

``` cicada
function my_list_cons_and_typeof_pair(
  returned A: Type,
  head: A,
  tail: List(A),
  implicit T: Type,
  x: T,
): Pair(List(A), Type) {
  return cons(li(head, tail), T)
}

check! my_list_cons_and_typeof_pair("a", nil, 123): Pair(List(String), Type)
check! my_list_cons_and_typeof_pair("a", nil, implicit Nat, 123): Pair(List(String), Type)

check! my_list_cons_and_typeof_pair(1, nil, "abc"): Pair(List(Nat), Type)
check! my_list_cons_and_typeof_pair(1, nil, implicit String, "abc"): Pair(List(Nat), Type)
```
