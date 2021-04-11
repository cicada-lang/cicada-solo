# Syntax Summary

## stmts

- @def name exp
- @show exp

## exps

type:
- Type

let:
- @let name exp exp

the:
- @the t exp

pi:
- [@forall] (name: arg_t) -> ret_t
- (arg_t) -> ret_t
- (name) => ret
- target(arg, ...)

sigma:
- [@exists] (name: car_t * cdr_t)
- Pair(car_t, cdr_t)
- cons(car, cdr)
- car(target)
- cdr(target)

class:
- [ name: t, ... ]
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
