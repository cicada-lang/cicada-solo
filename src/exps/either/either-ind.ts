import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class EitherInd extends Exp {
  target: Exp
  motive: Exp
  base_left: Exp
  base_right: Exp

  constructor(target: Exp, motive: Exp, base_left: Exp, base_right: Exp) {
    super()
    this.target = target
    this.motive = motive
    this.base_left = base_left
    this.base_right = base_right
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.base_left.free_names(bound_names),
      ...this.base_right.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new EitherInd(
      this.target.subst(name, exp),
      this.motive.subst(name, exp),
      this.base_left.subst(name, exp),
      this.base_right.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const either_t = expect(ctx, inferred_target.t, Cores.EitherValue)
    const motive_t = either_ind_motive_t(either_t)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)
    const base_left_core = check(
      ctx,
      this.base_left,
      either_ind_base_left_t(either_t.left_t, motive_value)
    )
    const base_right_core = check(
      ctx,
      this.base_right,
      either_ind_base_right_t(either_t.right_t, motive_value)
    )
    const target_core = inferred_target.core
    const target_value = evaluate(ctx.to_env(), target_core)

    return {
      t: Cores.Ap.apply(motive_value, target_value),
      core: new Cores.EitherInd(
        target_core,
        motive_core,
        base_left_core,
        base_right_core
      ),
    }
  }

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base_left.repr(),
      this.base_right.repr(),
    ].join(", ")

    return `either_ind(${args})`
  }
}

export function either_ind_motive_t(either_t: Value): Value {
  return evaluate(
    new Env().extend("either_t", either_t),
    new Cores.Pi("target_either", new Cores.Var("either_t"), new Cores.Type())
  )
}

export function either_ind_base_left_t(left_t: Value, motive: Value): Value {
  return evaluate(
    new Env().extend("motive", motive).extend("left_t", left_t),
    new Cores.Pi(
      "left",
      new Cores.Var("left_t"),
      new Cores.Ap(
        new Cores.Var("motive"),
        new Cores.Inl(new Cores.Var("left"))
      )
    )
  )
}

export function either_ind_base_right_t(right_t: Value, motive: Value): Value {
  return evaluate(
    new Env().extend("motive", motive).extend("right_t", right_t),
    new Cores.Pi(
      "right",
      new Cores.Var("right_t"),
      new Cores.Ap(
        new Cores.Var("motive"),
        new Cores.Inr(new Cores.Var("right"))
      )
    )
  )
}
