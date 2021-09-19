import { Exp, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Trace } from "../../errors"
import * as Exps from ".."
import * as ut from "../../ut"

export class BaseImPi extends Exps.ImPi {
  field_name: string
  local_name: string
  arg_t: Exp
  ret_t: Exps.Pi

  constructor(
    field_name: string,
    local_name: string,
    arg_t: Exp,
    ret_t: Exps.Pi
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.local_name])),
    ])
  }

  subst(name: string, exp: Exp): BaseImPi {
    if (name === this.local_name) {
      return new BaseImPi(
        this.local_name,
        this.field_name,
        subst(this.arg_t, name, exp),
        this.ret_t
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.local_name)
      const ret_t = subst(
        this.ret_t,
        this.local_name,
        new Exps.Var(fresh_name)
      ) as Exps.Pi

      return new BaseImPi(
        this.field_name,
        fresh_name,
        subst(this.arg_t, name, exp),
        subst(ret_t, name, exp) as Exps.Pi
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.local_name)
    const arg_t_core = check(ctx, this.arg_t, new Exps.TypeValue())
    const arg_t_value = evaluate(ctx.to_env(), arg_t_core)
    const ret_t = subst(this.ret_t, this.local_name, new Exps.Var(fresh_name))
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
      core: new Exps.BaseImPiCore(fresh_name, arg_t_core, ret_t_core),
    }
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const entry = `given ${this.field_name}: ${this.arg_t.repr()}`
    return this.ret_t.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }
}
