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
- let name exp exp

the:
- the t exp

pi:
- (name: arg_t) -> ret_t
- (arg_t) -> ret_t
- (name) => ret
- target(arg, ...)

sigma:
- (name: car_t) * cdr_t
- (car_t) * cdr_t
- cons(car, cdr)
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
- TODO("...")
