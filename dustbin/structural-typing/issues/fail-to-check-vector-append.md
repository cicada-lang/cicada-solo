# fail to check `case vector_null_t` of `vector_append`

## case

``` scala
vector_append : {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
} = {
  case
      A : type
      m : zero_t
      n : nat_t
      x : vector_null_t(A, zero)
      y : vector_t(A, n)
      => y
}
```

## error

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

## solution

the problem is due to,
fail to check equivalent between `m : zero_t` and `zero`

- [solution 0] we can write
  ``` scala
  case
      A : type
      m : zero_t
      n : nat_t
      x : vector_null_t(A, m)
      y : vector_t(A, n)
      => y
  ```
  instead of
  ``` scala
  case
      A : type
      m : zero_t
      n : nat_t
      x : vector_null_t(A, zero)
      y : vector_t(A, n)
      => y
  ```
- [solution 1] maybe allow value in pattern of case lambda.
- [solution 2] maybe type with only one possible element
  should be handled specially.

# fail to check `case vector_cons_t` of `vector_append`

## case

``` scala
vector_append : {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
} = {
  case
      A : type
      m : succ_t
      n : nat_t
      x : vector_cons_t(A, m.prev)
      y : vector_t(A, n)
      => {
        A = A
        prev = nat_add(m, n).prev
        head = x.head
        length = nat_add(m, n)
        tail = vector_append(A, x.prev, n, x.tail, y)
      }
}
```

## error

``` scala
------
check fail
exp: {
  case A : type, m : succ_t, n : nat_t, x : vector_cons_t(A, m.prev), y : vector_t(A, n) => object {
    A = A
    prev = nat_add(m, n).prev
    head = x.head
    length = nat_add(m, n)
    tail = vector_append(A, x.prev, n, x.tail, y)
  }
  case A : type, m : zero_t, n : nat_t, x : vector_null_t(A, m), y : vector_t(A, n) => y
}
value: {
  case A : type, m : succ_t, n : nat_t, x : vector_cons_t(A, m.prev), y : vector_t(A, n) => object {
    A = A
    prev = nat_add(m, n).prev
    head = x.head
    length = nat_add(m, n)
    tail = vector_append(A, x.prev, n, x.tail, y)
  }
  case A : type, m : zero_t, n : nat_t, x : vector_null_t(A, m), y : vector_t(A, n) => y
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
  A : type = check:FnCase:A:A#71640196-2070-4d3c-86d9-cc60f56e43bd
  prev : class {} = check:FnCase:m:m#78febad0-977a-475c-994e-4e27b4431ece.prev
  head : A
  length : succ_t(prev)
  tail : vector_t(A, prev)
}
t: class {
  A : type = check:FnCase:A:A#71640196-2070-4d3c-86d9-cc60f56e43bd
  length : class {} = check:FnCase:m:m#78febad0-977a-475c-994e-4e27b4431ece
}
------
subtype fail between ValueCl and ValueCl
missing name in the subtype class's defined
name: length
------
```

## solution

maybe the problem is about `vector_cons_t`

``` scala
class vector_cons_t {
  A : type
  prev : nat_t
  head : A
  length : succ_t(prev)
  tail : vector_t(A, prev)
}
```

- [solution 0] we need to use `let` and `define` in class,
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

# fail to check `case vector_cons_t` of `vector_append`

## case

``` scala
class vector_cons_t {
  A : type
  prev : nat_t
  head : A
  length = succ(prev)
  tail : vector_t(A, prev)
}

one_zeros : vector_cons_t = {
  A = nat_t
  prev = zero
  head = zero
  length = one
  tail = {
    A = nat_t
    length = zero
  }
}

vector_append : {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
} = choice {
  case
    A : type
    m : succ_t
    n : nat_t
    x : vector_cons_t(A, m.prev)
    y : vector_t(A, n) => {
      A = A
      prev = nat_add(m, n).prev
      head = x.head
      tail = vector_append(A, x.prev, n, x.tail, y)
    }
  case
    A : type
    m : zero_t
    n : nat_t
    x : vector_null_t(A, m)
    y : vector_t(A, n)
      => y
}
```

## error

``` scala
------
equivalent fail
s: {
  prev : {} = check:Fn:m:m#Hw3B_IfwxBAzg8ewuyoTP.prev
}
t: check:Fn:m:m#Hw3B_IfwxBAzg8ewuyoTP
------
equivalent fail
unhandled class of Value pair
s class name: Obj
t class name: Var
------
```

## solution

It is always true that `succ(x.prev) == x`,
but is it always true that `{ prev: x.prev } == x`?

Maybe not.

``` scala
class vector_cons_t {
  A : type
  length : succ_t
  prev = length.prev
  head : A
  tail : vector_t(A, prev)
}

one_zeros : vector_cons_t = {
  A = nat_t
  head = zero
  prev = zero
  length = one
  tail = {
    A = nat_t
    length = zero
  }
}

vector_append : {
  A : type
  m : nat_t
  n : nat_t
  x : vector_t(A, m)
  y : vector_t(A, n)
  -> vector_t(A, nat_add(m, n))
} = choice {
  case
    A : type
    m : succ_t
    n : nat_t
    x : vector_cons_t(A, m)
    y : vector_t(A, n) => {
      A = A
      length = nat_add(m, n)
      head = x.head
      tail = vector_append(A, x.prev, n, x.tail, y)
    }
  case
    A : type
    m : zero_t
    n : nat_t
    x : vector_null_t(A, m)
    y : vector_t(A, n)
      => y
}
```
