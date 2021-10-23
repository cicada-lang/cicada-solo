import { Exp, ExpMeta, ElaborationOptions, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { infer } from "../../exp"
import { expect } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

export class EitherInd extends Exp {
  meta: ExpMeta
  target: Exp
  motive: Exp
  base_left: Exp
  base_right: Exp

  constructor(
    target: Exp,
    motive: Exp,
    base_left: Exp,
    base_right: Exp,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
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
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      subst(this.base_left, name, exp),
      subst(this.base_right, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const either_t = expect(ctx, inferred_target.t, Exps.EitherValue)
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
      t: Exps.ApCore.apply(motive_value, target_value),
      core: new Exps.EitherIndCore(
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
    Env.init().extend("either_t", either_t),
    new Exps.PiCore(
      "target_either",
      new Exps.VarCore("either_t"),
      new Exps.TypeCore()
    )
  )
}

export function either_ind_base_left_t(left_t: Value, motive: Value): Value {
  return evaluate(
    Env.init().extend("motive", motive).extend("left_t", left_t),
    new Exps.PiCore(
      "left",
      new Exps.VarCore("left_t"),
      new Exps.ApCore(
        new Exps.VarCore("motive"),
        new Exps.InlCore(new Exps.VarCore("left"))
      )
    )
  )
}

export function either_ind_base_right_t(right_t: Value, motive: Value): Value {
  return evaluate(
    Env.init().extend("motive", motive).extend("right_t", right_t),
    new Exps.PiCore(
      "right",
      new Exps.VarCore("right_t"),
      new Exps.ApCore(
        new Exps.VarCore("motive"),
        new Exps.InrCore(new Exps.VarCore("right"))
      )
    )
  )
}
