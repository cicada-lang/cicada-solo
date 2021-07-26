import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../exp"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class PiImplicit extends Exp {
  name: string
  arg_t: Exp
  pi: Exps.Pi

  constructor(name: string, arg_t: Exp, pi: Exps.Pi) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.pi = pi
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.pi.arg_t.free_names(new Set([...bound_names, this.name])),
      ...this.pi.ret_t.free_names(
        new Set([...bound_names, this.name, this.pi.name])
      ),
    ])
  }

  subst(name: string, exp: Exp): PiImplicit {
    if (name === this.name) {
      return new PiImplicit(this.name, this.arg_t.subst(name, exp), this.pi)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const pi = this.pi.subst(this.name, new Exps.Var(fresh_name))

      return new PiImplicit(
        fresh_name,
        this.arg_t.subst(name, exp),
        pi.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    throw new Error("TODO")
    // const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    // const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    // const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    // const ret_t = this.ret_t.subst(this.name, new Exps.Var(fresh_name))
    // const ret_t_core = check(
    //   ctx.extend(fresh_name, arg_t_value),
    //   ret_t,
    //   new Exps.TypeValue()
    // )

    // return {
    //   t: new Exps.TypeValue(),
    //   core: new Exps.PiCore(fresh_name, arg_t_core, ret_t_core),
    // }
  }

  repr(): string {
    const entries_repr = [
      `${this.name}: ${this.arg_t.repr()}`,
      `${this.pi.name}: ${this.pi.arg_t.repr()}`,
    ].join(", ")

    return `(${entries_repr}) -> ${this.pi.ret_t.repr()}`
  }
}
