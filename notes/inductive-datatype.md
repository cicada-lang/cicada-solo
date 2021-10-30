---
title: Inductive datatype
---

# Note

已有的 inductive type 是什么？
如果把它们写成 data 的定义，会是什么样的？

尝试从这些例子里形成假说，做抽象，以求一个一般规则。

与其去看教科书中如何实现 inductive type，
自己去研究的过程要有价值的多。

阿兰 孔涅（Alain Connes）所说的「数学家的觉醒」。

看欧拉的数学，就会发现，他所表达的，正是这种发现模式以及归纳的艺术。

其实，生成 ind 就是生成 ind 的 type，
而 ind 的 type 读出来就是对所定义的 data 的[数学归纳法][Mathematical induction]。
所以我们可以尝试不是 strict positive 的 inductive type，
看看为什么读为数学归纳法的时候会失败。

[Mathematical induction]: https://en.wikipedia.org/wiki/Mathematical_induction

# 例子

## Nat

``` cicada not-yet
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}
```

``` cicada
ind_nat_t = (
  target: Nat,
  motive: (Nat) -> Type,
  // NOTE [hypothesis cases]
  //   One case one callback,
  //   which take all constructor arguments.
  case_zero: motive(zero),
  case_add1: (
    prev: Nat,
    almost_on_prev: motive(prev),
  ) -> motive(add1(prev)),
) -> motive(target)
```

Suppose we have `induction (target, motive) { ... }`.

``` cicada not-yet
induction (target, motive) {
  case zero => ...
  case add1(prev) (almost_on_prev) => ...
}
```

## List

``` cicada not-yet
datatype List(E: Type) {
  nil: List(E)
  li(head: E, tail: List(E)): List(E)
}
```

``` cicada
ind_list_t = (
  implicit { E: Type },
  target: List(E),
  motive: (List(E)) -> Type,
  case_nil: motive(nil),
  // NOTE [hypothesis almost]
  //   One recursive occurrence of the defined type one almost for case,
  //   whose type is the `motive` applied to the recursive occurrence parameter.
  case_li: (
    head: E, tail: List(E),
    almost_on_tail: motive(tail),
  ) -> motive(li(head, tail)),
) -> motive(target)
```

``` cicada not-yet
induction (target, motive) {
  case nil => ...
  case li(head, tail) (almost_on_tail) => ...
}
```

## Vector

``` cicada not-yet
datatype Vector(E: Type, length: Nat) {
  vecnil: Vector(E, zero)
  vec(head: E, tail: Vector(E, prev)): Vector(E, zero)
}
```

These new inductive datatypes might have both *parameters*,
which do not vary between the constructors,
and *indices*, which can vary between them.

In the definition of `Vector`, `E` is a parameter, `length` is an index.

``` cicada
vector_ind_t: Type = (
  implicit { E: Type, length: Nat },
  target: Vector(E, length),
  // NOTE [hypothesis motive]
  //   The `motive` does not take parameter, but take index.
  motive: (
    length: Nat,
    target: Vector(E, length),
  ) -> Type,
  case_vecnil: motive(0, vecnil),
  // NOTE [problem indices in case argument]
  //   Should we make the indices implicit?
  case_vec: (
    head: E,
    implicit { prev: Nat },
    tail: Vector(E, prev),
    almost_on_tail: motive(prev, tail),
  ) -> motive(add1(prev), vec(head, tail)),
) -> motive(length, target)
```

## Either

``` cicada not-yet
datatype Either(L, R) {
  inl(left: L): Either(L, R)
  inr(right: R): Either(L, R)
}
```

``` cicada
either_ind_t = (
  implicit { L: Type, R: Type },
  target: Either(L, R),
  motive: (Either(L, R)) -> Type,
  case_inl: (left: L) -> motive(inl(left)),
  case_inr: (right: R) -> motive(inr(right)),
) -> motive(target)
```

``` cicada not-yet
induction (target, motive) {
  case inl(left) => ...
  case inr(right) => ...
}
```

## LessThan

``` cicada not-yet
datatype LessThan(j: Nat, k: Nat) {
  zero_smallest: (n: Nat) -> LessThan(zero, add1(n))
  add1_smaller: (
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ) -> LessThan(add1(j), add1(k))
}
```

``` cicada
LessThan(j: Nat, k: Nat): Type {
  @TODO "LessThan"
}

zero_smallest(n: Nat): LessThan(zero, add1(n)) {
  @TODO "zero_smallest"
}

add1_smaller(
  j: Nat, k: Nat,
  prev_smaller: LessThan(j, k),
): LessThan(add1(j), add1(k)) {
  @TODO "add1_smaller"
}

ind_less_than_t = (
  implicit { j: Nat, k: Nat },
  target: LessThan(j, k),
  motive: (j: Nat, k: Nat, LessThan(j, k)) -> Type,
  case_zero_smallest: (n: Nat) -> motive(zero, add1(n), zero_smallest(n)),
  case_add1_smallest: (
    j: Nat, k: Nat, prev_smaller: LessThan(j, k),
    almost_on_prev_smaller: motive(j, k, prev_smaller),
  ) -> motive(add1(j), add1(k), prev_smaller),
) -> motive(j, k, target)
```

``` cicada not-yet
induction (target, motive) {
  case zero_smallest(n) => ...
  case add1_smaller(j, k, prev_smaller) (almost) => ...
}
```
