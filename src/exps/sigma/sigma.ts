import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
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

      return new Sigma(
        fresh_name,
        this.car_t.subst(name, exp),
        this.cdr_t.subst(this.name, new Exps.Var(fresh_name)).subst(name, exp)
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const car_t_core = check(ctx, this.car_t, new Exps.TypeValue())
    const car_t_value = evaluate(ctx.to_env(), car_t_core)
    const cdr_t = this.cdr_t.subst(this.name, new Exps.Var(fresh_name))
    const cdr_t_core = check(
      ctx.extend(fresh_name, car_t_value),
      cdr_t,
      new Exps.TypeValue()
    )

    return {
      t: new Exps.TypeValue(),
      core: new Exps.SigmaCore(fresh_name, car_t_core, cdr_t_core),
    }
  }

  multi_sigma_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    cdr_t: string
  } {
    const entry = `${this.name}: ${this.car_t.repr()}`

    if (this.cdr_t instanceof Sigma) {
      return this.cdr_t.multi_sigma_repr([...entries, entry])
    } else {
      return {
        entries: [...entries, entry],
        cdr_t: this.cdr_t.repr(),
      }
    }
  }

  repr(): string {
    const { entries, cdr_t } = this.multi_sigma_repr()
    return `(${entries.join(", ")}) * ${cdr_t}`
  }
}
