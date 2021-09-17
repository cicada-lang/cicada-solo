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

export class PiIm extends Exp {
  implicit: Array<{ name: string; arg_t: Exp }>
  ret_t: Exps.Pi

  constructor(implicit: Array<{ name: string; arg_t: Exp }>, ret_t: Exps.Pi) {
    super()
    this.implicit = implicit
    this.ret_t = ret_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    let names: Set<string> = new Set()

    for (const { name, arg_t } of this.implicit) {
      names = new Set([...names, ...arg_t.free_names(bound_names)])
      bound_names = new Set([...bound_names, name])
    }

    names = new Set([...names, ...this.ret_t.free_names(new Set(bound_names))])
    return names
  }

  subst(name: string, exp: Exp): PiIm {
    let implicit = [...this.implicit]
    let ret_t = this.ret_t

    for (let i = 0; i < implicit.length; i++) {
      const entry = implicit[i]
      if (name === entry.name) {
        implicit[i] = { name: entry.name, arg_t: entry.arg_t.subst(name, exp) }
      } else {
        const free_names = exp.free_names(new Set())
        const fresh_name = ut.freshen_name(free_names, entry.name)
        const variable = new Exps.Var(fresh_name)
        ret_t = ret_t.subst(entry.name, variable)
        for (let j = i; j < implicit.length; j++) {
          implicit[j].arg_t = implicit[j].arg_t.subst(entry.name, variable)
        }
        implicit[i] = { name: fresh_name, arg_t: entry.arg_t.subst(name, exp) }
        ret_t = ret_t.subst(name, exp)
      }
    }

    return new PiIm(implicit, ret_t)
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    let implicit = [...this.implicit]
    let ret_t = this.ret_t
    const implicit_core = []

    for (let i = 0; i < implicit.length; i++) {
      const entry = implicit[i]
      const fresh_name = ut.freshen_name(new Set(ctx.names), entry.name)
      const arg_t_core = check(ctx, entry.arg_t, new Exps.TypeValue())
      implicit_core.push([{ name: fresh_name, art_t: arg_t_core }])
      ret_t = ret_t.subst(entry.name, new Exps.Var(fresh_name))
      ctx = ctx.extend(fresh_name, evaluate(ctx.to_env(), arg_t_core))
    }

    const ret_t_core = check(ctx, ret_t, new Exps.TypeValue())

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
      core: new Exps.PiImCore(implicit_core, ret_t_core),
    }
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const implicit = this.implicit
      .map(({ name, arg_t }) => `${name}: ${arg_t.repr()}`)
      .join(", ")
    const entry = `implicit { ${implicit} }`
    return this.ret_t.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }
}
