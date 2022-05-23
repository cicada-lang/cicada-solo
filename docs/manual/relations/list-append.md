---
title: List Append
---

In Prolog:

```prolog
append([], Z, Z).
append([H | X], Y, [H | Z]):-
  append(X, Y, Z).
```

Give name to each clause in Prolog, is equivalent to
inductive datatype definition in language with dependent type.
When doing so, there will be no computation
in the resulting type, simple unification is enough
to solve the type check problem.
In general, inductive datatype in dependent can have computation.

```cicada todo
// in cicada:

@given A: Type
@datatype List.Append(x: List(A), y: List(A), z: List(A)) {
  null: List.Append(List.null, z, z)
  @given head: A
  cons(prev: List.Append(x, y, z)): List.Append(List.cons(head, x), y, List.cons(head, z))
}

// in cicada with inference syntax:

@given A: Type
@judgment List.Append(x: List(A), y: List(A), z: List(A)) {
  List.Append(List.null, z, z)
  ---------------------------- null

  List.Append(List.cons(head, x), y, List.cons(head, z))
  ------------------------------------------------------ cons
  prev: List.Append(x, y, z)
}
```
