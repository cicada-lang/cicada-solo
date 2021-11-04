---
title: Syntax Summary
---

# stmts

define:
- name = exp
- name: t = exp
- name(arg: arg_t, ...): ret_t = exp

show:
- exp

# exps

type:
- Type

let:
- name = exp; exp

problems about let:
- `name = exp; exp` is like python, should we use `let name = exp; exp`?

the:
- the(t, exp)
- is(exp, t)

pi:
- (name: arg_t) -> ret_t
- for all (a: A, b: B) -> C
- (arg_t) -> ret_t
- (name) => ret
- target(arg, ...)

old sigma:
- (name: car_t) * cdr_t
- (car_t) * cdr_t
- cons(car, cdr)
- car(target)
- cdr(target)

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
