# my_list_null

``` cicada
function my_list_null(vague A: Type): List(A) {
  return nil
}

check! my_list_null(vague Nat): List(Nat)

// NOTE zero-arity vague application
check! my_list_null: List(Nat)
check! my_list_null: List(String)
```

# my_list_cons

``` cicada
function my_list_cons(vague A: Type, head: A, tail: List(A)): List(A) {
  return li(head, tail)
}

check! my_list_cons(vague Nat, 123, nil): List(Nat)
check! my_list_cons(vague Nat): (Nat, List(Nat)) -> List(Nat)
check! my_list_cons(vague Nat)(123, nil): List(Nat)

check! my_list_cons(123, nil): List(Nat)
check! my_list_cons("a", nil): List(String)
check! my_list_cons("a", my_list_cons("b", nil)): List(String)
check! my_list_cons("a", my_list_cons("b", my_list_cons("c", nil))): List(String)
```

# my_list_null_pair

``` cicada
function my_list_null_pair(vague A: Type, vague B: Type): Pair(List(A), List(B)) {
  return cons(nil, nil)
}

check! my_list_null_pair(vague Nat, vague String): Pair(List(Nat), List(String))
check! my_list_null_pair(vague Nat)(vague String): Pair(List(Nat), List(String))

// NOTE zero-arity and nested vague application
check! my_list_null_pair: Pair(List(Nat), List(String))
check! my_list_null_pair: Pair(List(String), List(Nat))

// NOTE start inserting vague application from the first non-`vague` argument
// - this behavior is the same as the behavior of `implicit`
check! my_list_null_pair(vague String): Pair(List(String), List(Nat))

// NOTE if the given type is also a vague pi, we can also handle it,
//   because we try each possible case during unification.
check! my_list_null_pair: Pair(List(Nat), List(String))
check! my_list_null_pair: (vague B: Type) -> Pair(List(Nat), List(B))
check! my_list_null_pair: (vague A: Type, vague B: Type) -> Pair(List(A), List(B))
check! my_list_null_pair(vague String): Pair(List(String), List(Nat))
check! my_list_null_pair(vague String): (vague B: Type) -> Pair(List(String), List(B))
```

# my_list_null_and_typeof_pair

``` cicada
function my_list_null_and_typeof_pair(
  vague A: Type,
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
  vague A: Type,
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

# my_list_null_pair_and_typeof_pair

``` cicada
function my_list_null_pair_and_typeof_pair(
  vague A: Type,
  vague B: Type,
  implicit T: Type,
  x: T,
): Pair(Pair(List(A), List(B)), Type) {
  return cons(cons(nil, nil), T)
}

check! my_list_null_pair_and_typeof_pair(123): Pair(Pair(List(String), List(String)), Type)
check! my_list_null_pair_and_typeof_pair(vague String, 123): Pair(Pair(List(String), List(String)), Type)
check! my_list_null_pair_and_typeof_pair(vague String, vague String, 123): Pair(Pair(List(String), List(String)), Type)

// NOTE partly applied `vague-fn` can be bound to variable

check! {
  let f: (
    vague B: Type,
    implicit T: Type,
    x: T,
  ) -> Pair(Pair(List(String), List(B)), Type) =
    my_list_null_pair_and_typeof_pair(vague String)

  return f(vague Nat, 123)
}: Pair(Pair(List(String), List(Nat)), Type)

check! {
  let f = my_list_null_pair_and_typeof_pair(vague String)
  return f(vague Nat, 123)
}: Pair(Pair(List(String), List(Nat)), Type)

check! {
  let f = my_list_null_pair_and_typeof_pair(vague String)
  return f(123)
}: Pair(Pair(List(String), List(Nat)), Type)
```
