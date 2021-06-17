import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Sigma extends Exp {
  name: string
  car_t: Exp
  cdr_t: Exp

  constructor(name: string, car_t: Exp, cdr_t: Exp) {
    super()
    this.name = name
    this.car_t = car_t
    this.cdr_t = cdr_t
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.car_t.free_names(bound_names),
      ...this.cdr_t.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      return new Sigma(this.name, this.car_t.subst(name, exp), this.cdr_t)
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const cdr_t = this.cdr_t.rename(this.name, fresh_name)

      return new Sigma(
        fresh_name,
        this.car_t.subst(name, exp),
        cdr_t.subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const car_t_core = check(ctx, this.car_t, new Cores.TypeValue())
    const car_t_value = evaluate(ctx.to_env(), car_t_core)
    const cdr_t = this.cdr_t.rename(this.name, fresh_name)
    const cdr_t_core = check(
      ctx.extend(fresh_name, car_t_value),
      cdr_t,
      new Cores.TypeValue()
    )

    return {
      t: new Cores.TypeValue(),
      core: new Cores.Sigma(fresh_name, car_t_core, cdr_t_core),
    }
  }

  repr(): string {
    return `(${this.name}: ${this.car_t.repr()}) * ${this.cdr_t.repr()}`
  }
}
