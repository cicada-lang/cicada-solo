import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../../ut"
import { PiFormater } from "../pi/pi-formater"

// NOTE We are implementing named argument,
//   thus we can not just use `name`,
//   we need `field_name` and `local_name` just like `Cls`.

export class ImPi extends Exp {
  meta: ExpMeta
  field_name: string
  local_name: string
  arg_t: Exp
  ret_t: Exps.Pi | Exps.ImPi

  constructor(
    field_name: string,
    local_name: string,
    arg_t: Exp,
    ret_t: Exps.Pi | Exps.ImPi,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.field_name = field_name
    this.local_name = local_name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  get name(): string {
    return this.field_name
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.arg_t.free_names(bound_names),
      ...this.ret_t.free_names(new Set([...bound_names, this.local_name])),
    ])
  }

  subst(name: string, exp: Exp): ImPi {
    if (name === this.local_name) {
      return new ImPi(
        this.local_name,
        this.field_name,
        subst(this.arg_t, name, exp),
        this.ret_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.local_name)
      const ret_t = subst(
        this.ret_t,
        this.local_name,
        new Exps.Var(fresh_name)
      ) as Exps.Pi | Exps.ImPi

      return new ImPi(
        this.field_name,
        fresh_name,
        subst(this.arg_t, name, exp),
        subst(ret_t, name, exp) as Exps.Pi | Exps.ImPi,
        this.meta
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

    if (
      !(
        ret_t_core instanceof Exps.PiCore || ret_t_core instanceof Exps.ImPiCore
      )
    ) {
      throw new ExpTrace(
        [
          `I expect ret_t_core to be Exps.PiCore or Exps.ImPiCore`,
          `  class name: ${ret_t_core.constructor.name}`,
        ].join("\n")
      )
    }

    return {
      t: new Exps.TypeValue(),
      core: new Exps.ImPiCore(fresh_name, fresh_name, arg_t_core, ret_t_core),
    }
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_binding: (binding) => `implicit ${binding}`
  })

  format(): string {
    return this.pi_formater.format()

    // const args = this.format_args().join(", ")
    // const ret_t = this.ret_t.pi_formater.format_ret_t()
    // return `(${args}) -> ${ret_t}`
  }

  format_args(): Array<string> {
    const entry = `implicit { ${this.format_im_args().join(", ")} }`
    if (this.ret_t instanceof Exps.Pi) {
      return [entry, ...this.ret_t.pi_formater.format_args()]
    } else {
      // NOTE replace the head of the `entries`.
      return [entry, ...this.ret_t.format_args().slice(1)]
    }
  }

  format_im_args(): Array<string> {
    const entry = `${this.field_name}: ${this.arg_t.format()}`
    if (this.ret_t instanceof Exps.Pi) {
      return [entry]
    } else {
      return [entry, ...this.ret_t.format_im_args()]
    }
  }
}
