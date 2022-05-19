---
title: Vague Arguments
---

Remind the definition of `List`.

```cicada
datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}
```

After the definition `List.null` is a `List(String)`.

```cicada
check List.null: List(String)
```

`List.null` is also a `List(Trivial)`.

```cicada
check List.null: List(Trivial)
```

How can `List.null` be both `List(String)` and `List(Trivial)`?

Because `List.null` has been `vague` about its argument.

The type of `List.null` is actually `(vague E: Type) -> List(E)`.

```cicada
check List.null: (vague E: Type) -> List(E)
```

We can also explicitly apply `List.null` to a **vague argument**.

```cicada
check List.null(vague String): List(String)
check List.null(vague Trivial): List(Trivial)
```

A **vague argument** is like an **implicit argument**,
but it is resolved during type checking,
by the information of the return type.

# How it works?

For example,
we can use **vague arguments**
to define a function -- `my_list_null`,
who works just like the data constructor `List.null`.

```cicada
function my_list_null(vague E: Type): List(E) {
  return List.null
}

check my_list_null: List(String)
check my_list_null: List(Trivial)
```

Suppose I am the type checker, I am checking `my_list_null: List(String)`.

1. I infer `my_list_null` to be `(vague E: Type) -> List(E)`;
2. I compare the given return type `List(String)` with `List(E)`;
3. Now I know `E = String`;
4. I insert the vague argument for `my_list_null`, to get `my_list_null(vague String)`.

We can also define `my_list_cons` to be like `List.cons`.

```cicada
function my_list_cons(vague E: Type, head: E, tail: List(E)): List(E) {
  return List.cons(head, tail)
}

check my_list_cons(vague String, "abc", my_list_null): List(String)

// We can omit the vague argument.
check my_list_cons("abc", my_list_null): List(String)

// More examples:
check my_list_cons("a", my_list_null): List(String)
check my_list_cons("a", my_list_cons("b", my_list_null)): List(String)
check my_list_cons("a", my_list_cons("b", my_list_cons("c", my_list_null))): List(String)
```
