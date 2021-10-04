import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { expect } from "../../value"
import { check_conversion } from "../../value"
import * as Exps from ".."

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

  // NOTE
  // same_as_chart! Nat [
  //   add1(add1(add1(0))),
  //   add1(add1(1)),
  //   add1(2),
  //   3,
  // ]
  // expand to:
  // _ = is(same(add1(add1(add1(0)))), Equal(Nat, add1(add1(add1(0))), add1(add1(1))))
  // _ = is(same(add1(add1(add1(0)))), Equal(Nat, add1(add1(1)), add1(2)))
  // _ = is(same(add1(add1(add1(0)))), Equal(Nat, add1(2), 3))
  // _

  infer(ctx: Ctx): { t: Value; core: Core } {
    const t_core = check(ctx, this.t, new Exps.TypeValue())
    const t = evaluate(ctx.to_env(), t_core)

    const cores = this.exps.map((exp) => check(ctx, exp, t))
    const values = cores.map((core) => evaluate(ctx.to_env(), core))

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
      core: new Exps.ReflCore(),
    }
  }

  repr(): string {
    const exps = this.exps.map((exp) => exp.repr()).join(", ")
    return `same_as_chart! ${this.t.repr()} [ ${exps} ]`
  }
}
