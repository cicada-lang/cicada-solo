import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Pi extends Exp {
  meta: ExpMeta
  name: string
  arg_t: Exp
  ret_t: Exp

  constructor(name: string, arg_t: Exp, ret_t: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Pi {
    if (name === this.name) {
      return new Pi(
        this.name,
        subst(this.arg_t, name, exp),
        this.ret_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)
      const ret_t = subst(this.ret_t, this.name, new Exps.Var(fresh_name))

      return new Pi(
        fresh_name,
        subst(this.arg_t, name, exp),
        subst(ret_t, name, exp),
        this.meta
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.name)
    const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t = subst(this.ret_t, this.name, new Exps.Var(fresh_name))
    const ret_t_core = check(
      ctx.extend(fresh_name, arg_t_value),
      ret_t,
      new Exps.TypeValue()
    )

    return {
      t: new Exps.TypeValue(),
      core: new Exps.PiCore(fresh_name, arg_t_core, ret_t_core),
    }
  }

  pi_args_repr(): Array<string> {
    const entry = `${this.name}: ${this.arg_t.repr()}`
    if (has_pi_args_repr(this.ret_t)) {
      return [entry, ...this.ret_t.pi_args_repr()]
    } else {
      return [entry]
    }
  }

  pi_ret_t_repr(): string {
    if (has_pi_ret_t_repr(this.ret_t)) {
      return this.ret_t.pi_ret_t_repr()
    } else {
      return this.ret_t.repr()
    }
  }

  repr(): string {
    const args = this.pi_args_repr().join(", ")
    const ret_t = this.pi_ret_t_repr()
    return `(${args}) -> ${ret_t}`
  }
}

function has_pi_args_repr(
  exp: Exp
): exp is Exp & { pi_args_repr(): Array<string> } {
  return (exp as any).pi_args_repr instanceof Function
}

function has_pi_ret_t_repr(exp: Exp): exp is Exp & { pi_ret_t_repr(): string } {
  return (exp as any).pi_ret_t_repr instanceof Function
}
