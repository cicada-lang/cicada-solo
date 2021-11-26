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

// NOTE zero-arity and nested returned application
check! my_list_null_pair: Pair(List(Nat), List(String))
check! my_list_null_pair: Pair(List(String), List(Nat))
```
