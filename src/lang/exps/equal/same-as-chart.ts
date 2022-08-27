import * as Exps from ".."
import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import { check_conversion, Value } from "../../value"

export class SameAsChart extends Exp {
  meta: ExpMeta
  t: Exp
  exps: Array<Exp>

  constructor(t: Exp, exps: Array<Exp>, meta: ExpMeta) {
    super()
    this.meta = meta
    this.t = t
    this.exps = exps
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.t.free_names(bound_names),
      ...this.exps.flatMap((exp) => Array.from(exp.free_names(bound_names))),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new SameAsChart(
      subst(this.t, name, exp),
      this.exps.map((exp) => subst(exp, name, exp)),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t = evaluate(ctx.toEnv(), t_core)

    const cores = this.exps.map((exp) => check(ctx, exp, t))
    const values = cores.map((core) => evaluate(ctx.toEnv(), core))

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      const next = values[i + 1]

      if (next !== undefined) {
        check_conversion(ctx, t, value, next, {
          description: {
            from: `value at ${i}`,
            to: `value at ${i + 1}`,
          },
        })
      }
    }

    return {
      t: new Exps.EqualValue(t, values[0], values[values.length - 1]),
      core: new Exps.GlobalCore("refl"),
    }
  }

  format(): string {
    const exps = this.exps.map((exp) => exp.format()).join(", ")
    return `same_as_chart (${this.t.format()}) [ ${exps} ]`
  }
}
