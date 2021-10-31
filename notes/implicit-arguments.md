---
title: Implicit arguments
---

# Review rules about non-implicit `Fn` and `Ap`

``` typescript
Pi(name: string, arg_t: Exp, ret_t: Exp)
Fn(name: string, ret: Exp)
Ap(target: Exp, arg: Exp)

infer(ctx, Pi(name, arg_t, ret_t)) {
  arg_t_core = check(ctx, arg_t, Type)
  ret_t_core = check(ctx.extend(name, arg_t_core), ret_t, Type)
  [ Type, PiCore(name, arg_t_core, ret_t_core) ]
}

check(ctx, Fn(name, ret), Pi(name, arg_t, ret_t)) {
  check(ctx.extend(name, arg_t), ret, ret_t)
}

infer(ctx, Ap(target, arg)) {
  [ Pi(name, arg_t, ret_t), target_core ] = infer(ctx, target)
  arg_core = check(ctx.extend(name, arg_t), ret_t, Type)
  [ ret_t.solution(name, arg_core), ApCore(target_core, arg_core) ]
}
```

# The rules about implicit `Fn` and `Ap`

``` typescript
ImPi(given: { name: string, arg_t }, name: string, arg_t: Exp, ret_t: Exp)
ImFn(given: { name: string }, name: string, ret: Exp)
ImAp(target: Exp, arg: Exp)

infer(ctx, ImPi(given, name, arg_t, ret_t)) {
  ...
  [ Type, ImPiCore(given, name, arg_t_core, ret_t_core) ]
}

check(ctx, Fn(name, ret), ImPi(given, name, arg_t, ret_t)) {
  fn_core = check(ctx.extend(given.name, given.arg_t).extend(name, arg_t), ret, ret_t)
  ImFnCore(...)
}

infer(ctx, Ap(target, arg)) {
  [ ImPi(given, name, arg_t, ret_t), target_core ] = infer(ctx, target)
  [ arg_t_value, arg_core ] = infer(ctx, arg)
  solution = solve(arg_t_value, arg_t)
  arg_core = check(ctx.extend(name, arg_t), ret_t, Type)
  [ ret_t.solution(name, arg_core).reify(solution),
    ApCore(
      ImApCore(
        target_core,
        solution.find(given.name)),
      arg_core).reify(solution)
   ]
}
```

# Understanding

## Implicit lambda insertion

Check `(x) { x }` against `(given A: Type, A) -> A`

1. `(x) { x }` is not an implicit lambda
2. Assume `A: Type` in context
3. Check `(x) { x }` against `(A) -> A`
4. Return `(given A, x) { x }`

With closure (the argument name of a closure is unknown):

Check `(x) { x }` against `(given Type) -> (closure A) => (A) -> A`

1. `(x) { x }` is not an implicit lambda
2. Assume `fresh_name: Type` in context
3. Check `(x) { x }` against `(fresh_name) -> fresh_name`
4. Return `(given fresh_name, x) { x }`

## Implicit argument insertion

Assume `id: (given A: Type, A) -> A`

Infer `id(true)`

1. Infer `(given A: Type, A) -> A` for `id`
2. Insert appilication to fresh meta `id(a)`
3. Now we have `id(a): (a) -> a`
4. Check argument `true` against `a` -- we can not check
5. Infer `Bool` for `true`
5. Unify expected `a` type with `Bool`

Simple version (always infer argument):

1. Infer `(given A: Type, A) -> A` for `id`
2. The given `A` will be viewed as a pattern variable
3. Infer `Bool` for `true`
4. Unify expected `A` type with `Bool`
5. Reify `id(given A, true)` to be `id(given Bool, true)` and return it

With closure (the argument name of a closure is unknown):

Assume `id: (given Type) -> (closure A) => (A) -> A`

Infer `id(true)`

1. Infer `(given Type) -> (closure A) => (A) -> A` for `id`
2. Generate fresh pattern variable `V`
2. Apply `(closure A) => (A) -> A` to `V` to get `pi` -- `(V) -> V`
3. Infer `Bool` for `true`
4. Unify `pi.arg_t` -- `V` type with `Bool`
5. Reify `id(given V, true)` to be `id(given Bool, true)`
  - This Reify is simply the solution of `V`
6. Reify `(V) -> V` to be `(Bool) -> Bool`
  - We can do this reify by apply the closure to the solution of `V`
6. Return -- core: `id(Bool)(true)`, t: `(Bool) -> Bool`

Maybe we can simply use the `ctx` instead of `Reify`.

## What can go wrong

```
poly: Maybe((given A: Type, A) -> A) =
  just((x) { x })
```

1. Infer `(given a: Type, a) -> Maybe(a)` for `just`
2. Insert appilication to fresh meta `just(a)`
3. Now we have `just(a): (a) -> Maybe(a)`
2. Check `(x) { x }` against `a`
3. Unknown checking type, thus we do not know what to insert
3. Infer `Maybe((b) -> b)` for `just((x) { x })`
4. Fail to unify with `Maybe((given A: Type, A) -> A)`

# Look back

When we want to make something implicit, we use unification.

Examples:
- global type inference
- implicit function type
