# Implicit function type

## Review rules about non-implicit `Fn` and `Ap`

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
  [ ret_t.subst(name, arg_core), ApCore(target_core, arg_core) ]
}

## The rules about implicit `Fn` and `Ap`

PiIm(name: string, arg_t: Exp, ret_t: Exp)
FnIm(name: string, ret: Exp) ???
ApIm(target: Exp, arg: Exp) ???

## Understand

TODO

## Look back

When we want to make something implicit, we use unification.

Examples:
- global type inference
- implicit function type
