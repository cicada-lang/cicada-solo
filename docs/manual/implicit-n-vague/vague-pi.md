---
section: Implicit & Vague
title: Vague Pi
---

# my_cons

``` cicada
function my_cons(
  vague A: Type,
  vague B: (A) -> Type,
  x: A,
  y: B(x),
): [x: A | B(x)] {
  return cons(x, y)
}

my_cons

// TODO unification fail
// check! my_cons("ratatouille", "baguette"): Pair(String, String)
```

# List

``` cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

# my_list_null

``` cicada
function my_list_null(vague A: Type): List(A) {
  return List.null
}

check! my_list_null(vague String): List(String)

// NOTE zero-arity vague application
check! my_list_null: List(String)
```

# my_list_cons

``` cicada
function my_list_cons(vague A: Type, head: A, tail: List(A)): List(A) {
  return List.cons(head, tail)
}

check! my_list_cons(vague String, "abc", List.null): List(String)
check! my_list_cons(vague String): (String, List(String)) -> List(String)
check! my_list_cons(vague String)("abc", List.null): List(String)

check! my_list_cons("abc", List.null): List(String)
check! my_list_cons("a", List.null): List(String)
check! my_list_cons("a", my_list_cons("b", List.null)): List(String)
check! my_list_cons("a", my_list_cons("b", my_list_cons("c", List.null))): List(String)
```

# my_list_null_pair

``` cicada
function my_list_null_pair(vague A: Type, vague B: Type): Pair(List(A), List(B)) {
  return cons(List.null, List.null)
}

check! my_list_null_pair(vague String, vague String): Pair(List(String), List(String))
check! my_list_null_pair(vague String)(vague String): Pair(List(String), List(String))

// NOTE zero-arity and nested vague application
check! my_list_null_pair: Pair(List(String), List(String))
check! my_list_null_pair: Pair(List(String), List(String))

// NOTE start inserting vague application from the first non-`vague` argument
// - this behavior is the same as the behavior of `implicit`
check! my_list_null_pair(vague String): Pair(List(String), List(String))

// NOTE if the given type is also a vague pi, we can also handle it,
//   because we try each possible case during unification.
check! my_list_null_pair: Pair(List(String), List(String))
check! my_list_null_pair: (vague B: Type) -> Pair(List(String), List(B))
check! my_list_null_pair: (vague A: Type, vague B: Type) -> Pair(List(A), List(B))
check! my_list_null_pair(vague String): Pair(List(String), List(String))
check! my_list_null_pair(vague String): (vague B: Type) -> Pair(List(String), List(B))
```

# my_list_null_and_typeof_pair

``` cicada
function my_list_null_and_typeof_pair(
  vague A: Type,
  implicit T: Type,
  x: T,
): Pair(List(A), Type) {
  return cons(List.null, T)
}

check! my_list_null_and_typeof_pair("abc"): Pair(List(String), Type)
check! my_list_null_and_typeof_pair(implicit String, "abc"): Pair(List(String), Type)

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
  return cons(List.cons(head, tail), T)
}

check! my_list_cons_and_typeof_pair("a", List.null, "abc"): Pair(List(String), Type)
check! my_list_cons_and_typeof_pair("a", List.null, implicit String, "abc"): Pair(List(String), Type)

check! my_list_cons_and_typeof_pair("a", List.null, "abc"): Pair(List(String), Type)
check! my_list_cons_and_typeof_pair("a", List.null, implicit String, "abc"): Pair(List(String), Type)
```

# my_list_null_pair_and_typeof_pair

``` cicada
function my_list_null_pair_and_typeof_pair(
  vague A: Type,
  vague B: Type,
  implicit T: Type,
  x: T,
): Pair(Pair(List(A), List(B)), Type) {
  return cons(cons(List.null, List.null), T)
}

check! my_list_null_pair_and_typeof_pair("abc"): Pair(Pair(List(String), List(String)), Type)
check! my_list_null_pair_and_typeof_pair(vague String, "abc"): Pair(Pair(List(String), List(String)), Type)
check! my_list_null_pair_and_typeof_pair(vague String, vague String, "abc"): Pair(Pair(List(String), List(String)), Type)
check! my_list_null_pair_and_typeof_pair(vague String, vague String, implicit String, "abc"): Pair(Pair(List(String), List(String)), Type)

// NOTE partly applied `vague-fn` can be bound to variable

check! {
  let f: (
    vague B: Type,
    implicit T: Type,
    x: T,
  ) -> Pair(Pair(List(String), List(B)), Type) =
    my_list_null_pair_and_typeof_pair(vague String)

  return f(vague String, "abc")
}: Pair(Pair(List(String), List(String)), Type)

check! {
  let f = my_list_null_pair_and_typeof_pair(vague String)
  return f(vague String, "abc")
}: Pair(Pair(List(String), List(String)), Type)

check! {
  let f = my_list_null_pair_and_typeof_pair(vague String)
  return f("abc")
}: Pair(Pair(List(String), List(String)), Type)
```
