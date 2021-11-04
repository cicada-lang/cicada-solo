---
title: Syntax Summary
---

# stmts

## define

``` cicada impression
name = exp
name: t = exp
name(arg: arg_t, ...): ret_t = exp
```

## show

``` cicada impression
exp
```

# exps

## type

``` cicada impression
Type
```

## let

``` cicada impression
name = exp; exp
```

## the

``` cicada impression
the(t, exp)
is(exp, t)
```

## pi

``` cicada impression
(name: arg_t) -> ret_t
for all (a: A, b: B) -> C
(arg_t) -> ret_t
(name) => ret
target(arg, ...)
```

sigma:
- [name: car_t | cdr_t]
- [car | cdr]
- [a: A | [b: B | C]]
- [a: A, b: B | C]
- there exists [a: A, b: B such that C]
- [a, b | c]
- car(target)
- cdr(target)

class:
- class { name: t, ... }
- { name: property, ... }
- target.name

equal:
- Equal(t, from, to)
- same
- replace(target, motive, base)

absurd:
- Absurd
- absurd_ind(target, motive)

nat:
- Nat
- zero
- add1(prev)
- nat_ind(target, motive, base, step)

string:
- String
- "..."

trivial:
- Trivial
- sole

todo:
- @TODO "..."
