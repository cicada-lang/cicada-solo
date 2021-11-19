import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check } from "../../exp"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class Sigma extends Exp {
  meta: ExpMeta
  name: string
  car_t: Exp
  cdr_t: Exp

  constructor(name: string, car_t: Exp, cdr_t: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
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
      return new Sigma(
        this.name,
        subst(this.car_t, name, exp),
        this.cdr_t,
        this.meta
      )
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen(free_names, this.name)

      return new Sigma(
        fresh_name,
        subst(this.car_t, name, exp),
        subst(
          subst(this.cdr_t, this.name, new Exps.Var(fresh_name)),
          name,
          exp
        ),
        this.meta
      )
    }
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const fresh_name = ctx.freshen(this.name)
    const car_t_core = check(ctx, this.car_t, new Exps.TypeValue())
    const car_t_value = evaluate(ctx.to_env(), car_t_core)
    const cdr_t = subst(this.cdr_t, this.name, new Exps.Var(fresh_name))
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

  sigma_cars_format(): Array<string> {
    const entry = `${this.name}: ${this.car_t.format()}`

    if (has_sigma_cars_format(this.cdr_t)) {
      return [entry, ...this.cdr_t.sigma_cars_format()]
    } else {
      return [entry]
    }
  }

  sigma_cdr_t_format(): string {
    if (has_sigma_cdr_t_format(this.cdr_t)) {
      return this.cdr_t.sigma_cdr_t_format()
    } else {
      return this.cdr_t.format()
    }
  }

  format(): string {
    const cars = this.sigma_cars_format().join(", ")
    const cdr_t = this.sigma_cdr_t_format()
    return `[${cars} | ${cdr_t}]`
  }
}

function has_sigma_cars_format(
  exp: Exp
): exp is Exp & { sigma_cars_format(): Array<string> } {
  return (exp as any).sigma_cars_format instanceof Function
}

function has_sigma_cdr_t_format(
  exp: Exp
): exp is Exp & { sigma_cdr_t_format(): string } {
  return (exp as any).sigma_cdr_t_format instanceof Function
}
