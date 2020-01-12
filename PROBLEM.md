# `vector_append`

fail to check

``` scala
vector_append : {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
} = {
//   case
//       A : type
//       m : succ_t
//       n : nat_t
//       x : vector_cons_t(A, m.prev)
//       y : vector_t(A, n)
//       => vector_append(A, x.prev, n, x.tail, y)
  case
      A : type
      m : zero_t
      n : nat_t
      x : vector_null_t(A, zero)
      y : vector_t(A, n)
      => y
}
```

error:

``` scala
------
check fail
exp: {
  case A : type, m : zero_t, n : nat_t, x : vector_null_t(A, zero), y : vector_t(A, n) => y
}
value: {
  case A : type, m : zero_t, n : nat_t, x : vector_null_t(A, zero), y : vector_t(A, n) => y
}
type: {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
}
------
subtype fail
s: class {
  A : type = check:FnCase:A:A#94e7efcd-3ef1-4fc6-9751-65932f2b0c4c
  length : class {} = object {}
}
t: class {
  A : type = check:FnCase:A:A#94e7efcd-3ef1-4fc6-9751-65932f2b0c4c
  length : class {} = check:FnCase:m:m#87afe94f-e4fa-4c1f-9b72-ba5065469995
}
------
equivalent fail
s: object {}
t: check:FnCase:m:m#87afe94f-e4fa-4c1f-9b72-ba5065469995
------
equivalent fail
meet unhandled case
------
```

fail to check equivalent between `m : zero_t` and `zero`

Solution:
- maybe type with only one possible element
  should be handled specially.

# `vector_cons_t`

``` scala
class vector_cons_t {
  A : type
  prev : nat_t
  head : A
  length : succ_t(prev)
  tail : vector_t(A, prev)
}
```

we need to use `let` and `define` in class,
in any order,
not just `given` after `define`.

``` scala
class vector_cons_t {
  A : type
  prev : nat_t
  head : A
  length = succ(prev) : succ_t(prev)
  tail : vector_t(A, prev)
}
```
