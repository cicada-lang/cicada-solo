import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Subst } from "../../subst"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class ImPi extends Exp {
  name: string
  arg_t: Exp
  ret_t: Exps.Pi

  constructor(name: string, arg_t: Exp, ret_t: Exps.Pi) {
    super()
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

  subst(name: string, exp: Exp): ImPi {
    if (name === this.name) {
      return new ImPi(this.name, this.arg_t.subst(name, exp), this.ret_t)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const ret_t = this.ret_t.subst(this.name, new Exps.Var(fresh_name))

      return new ImPi(
        fresh_name,
        this.arg_t.subst(name, exp),
        ret_t.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t = this.ret_t.subst(this.name, new Exps.Var(fresh_name))
    const ret_t_core = check(
      ctx.extend(fresh_name, arg_t_value),
      ret_t,
      new Exps.TypeValue()
    )

    if (!(ret_t_core instanceof Exps.PiCore)) {
      throw new Trace(
        [
          `I expect ret_t_core to be Exps.PiCore`,
          `but the constructor name I meet is: ${ret_t_core.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return {
      t: new Exps.TypeValue(),
      core: new Exps.ImPiCore(fresh_name, arg_t_core, ret_t_core),
    }
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const entry = `given ${this.name}: ${this.arg_t.repr()}`
    return this.ret_t.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }
}
