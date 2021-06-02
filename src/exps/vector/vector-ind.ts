import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { check } from "../../check"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import { check_conversion } from "../../conversion"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class VectorInd extends Exp {
  length: Exp
  target: Exp
  motive: Exp
  base: Exp
  step: Exp

  constructor(length: Exp, target: Exp, motive: Exp, base: Exp, step: Exp) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Cores.VectorValue)
    const elem_t = vector_t.elem_t

    const length_core = check(ctx, this.length, new Cores.NatValue())
    const length_value = evaluate(ctx.to_env(), length_core)
    check_conversion(ctx, new Cores.NatValue(), length_value, vector_t.length, {
      description: {
        from: "given length",
        to: "inferred length of Vector",
      },
    })

    const motive_t = evaluate(
      new Env().extend("elem_t", elem_t),
      new Cores.Pi(
        "length",
        new Cores.Nat(),
        new Cores.Pi(
          "target_vector",
          new Cores.Vector(new Cores.Var("elem_t"), new Cores.Var("length")),
          new Cores.Type()
        )
      )
    )
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)

    const base_t = Cores.Ap.apply(
      Cores.Ap.apply(motive_value, new Cores.ZeroValue()),
      new Cores.VecnilValue()
    )
    const base_core = check(ctx, this.base, base_t)

    const step_t = vector_ind_step_t(motive_value, elem_t)
    const step_core = check(ctx, this.step, step_t)

    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    return {
      t: Cores.Ap.apply(
        Cores.Ap.apply(motive_value, length_value),
        target_value
      ),
      core: new Cores.VectorInd(
        length_core,
        inferred_target.core,
        motive_core,
        base_core,
        step_core
      ),
    }
  }

  repr(): string {
    const args = [
      this.length.repr(),
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `vector_ind(${args})`
  }
}

export function vector_ind_step_t(motive: Value, elem_t: Value): Value {
  return evaluate(
    new Env().extend("motive", motive).extend("elem_t", elem_t),
    new Cores.Pi(
      "length",
      new Cores.Nat(),
      new Cores.Pi(
        "head",
        new Cores.Var("elem_t"),
        new Cores.Pi(
          "tail",
          new Cores.Vector(new Cores.Var("elem_t"), new Cores.Var("length")),
          new Cores.Pi(
            "almost",
            new Cores.Ap(
              new Cores.Ap(new Cores.Var("motive"), new Cores.Var("length")),
              new Cores.Var("tail")
            ),
            new Cores.Ap(
              new Cores.Ap(
                new Cores.Var("motive"),
                new Cores.Add1(new Cores.Var("length"))
              ),
              new Cores.Vec(new Cores.Var("head"), new Cores.Var("tail"))
            )
          )
        )
      )
    )
  )
}
