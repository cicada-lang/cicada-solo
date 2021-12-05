import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { check, Exp, ExpMeta, infer, subst } from "../../exp"
import * as Exps from "../../exps"
import { check_conversion, expect, Value } from "../../value"

export class VectorInd extends Exp {
  meta: ExpMeta
  length: Exp
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(
    length: Exp,
    target: Exp,
    motive: Exp,
    base: Exp,
    step: Exp,
    meta: ExpMeta
  ) {
    super()
    this.meta = meta
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.length.free_names(bound_names),
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.base.free_names(bound_names),
      ...this.step.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): VectorInd {
    return new VectorInd(
      subst(this.length, name, exp),
      subst(this.target, name, exp),
      subst(this.motive, name, exp),
      subst(this.base, name, exp),
      subst(this.step, name, exp),
      this.meta
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Exps.VectorValue)
    const elem_t = vector_t.elem_t

    const length_core = check(ctx, this.length, new Exps.NatValue())
    const length_value = evaluate(ctx.to_env(), length_core)
    check_conversion(ctx, new Exps.NatValue(), length_value, vector_t.length, {
      description: {
        from: "given length",
        to: "inferred length of Vector",
      },
    })

    const motive_t = vector_ind_motive_t(elem_t)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)

    const base_t = Exps.ApCore.apply(
      Exps.ApCore.apply(motive_value, new Exps.ZeroValue()),
      new Exps.VecnilValue()
    )
    const base_core = check(ctx, this.base, base_t)

    const step_t = vector_ind_step_t(motive_value, elem_t)
    const step_core = check(ctx, this.step, step_t)

    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    return {
      t: Exps.ApCore.apply_args(motive_value, [length_value, target_value]),
      core: new Exps.VectorIndCore(
        length_core,
        inferred_target.core,
        motive_core,
        base_core,
        step_core
      ),
    }
  }

  format(): string {
    const args = [
      this.length.format(),
      this.target.format(),
      this.motive.format(),
      this.base.format(),
      this.step.format(),
    ].join(", ")

    return `vector_ind(${args})`
  }
}

export function vector_ind_motive_t(elem_t: Value): Value {
  return evaluate(
    Env.init().extend("elem_t", elem_t),
    new Exps.PiCore(
      "length",
      new Exps.NatCore(),
      new Exps.PiCore(
        "target_vector",
        new Exps.VectorCore(
          new Exps.VarCore("elem_t"),
          new Exps.VarCore("length")
        ),
        new Exps.TypeCore()
      )
    )
  )
}

export function vector_ind_step_t(motive: Value, elem_t: Value): Value {
  return evaluate(
    Env.init().extend("motive", motive).extend("elem_t", elem_t),
    new Exps.PiCore(
      "length",
      new Exps.NatCore(),
      new Exps.PiCore(
        "head",
        new Exps.VarCore("elem_t"),
        new Exps.PiCore(
          "tail",
          new Exps.VectorCore(
            new Exps.VarCore("elem_t"),
            new Exps.VarCore("length")
          ),
          new Exps.PiCore(
            "almost",
            new Exps.ApCore(
              new Exps.ApCore(
                new Exps.VarCore("motive"),
                new Exps.VarCore("length")
              ),
              new Exps.VarCore("tail")
            ),
            new Exps.ApCore(
              new Exps.ApCore(
                new Exps.VarCore("motive"),
                new Exps.Add1Core(new Exps.VarCore("length"))
              ),
              new Exps.VecCore(
                new Exps.VarCore("head"),
                new Exps.VarCore("tail")
              )
            )
          )
        )
      )
    )
  )
}
