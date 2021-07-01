import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../exp"
import { check } from "../../exp"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { check_conversion } from "../../value"
import { Value } from "../../value"
import * as Sem from "../../sem"

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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.length.free_names(bound_names),
      ...this.target.free_names(bound_names),
      ...this.motive.free_names(bound_names),
      ...this.base.free_names(bound_names),
      ...this.step.free_names(bound_names),
    ])
  }

  subst(name: string, exp: Exp): Exp {
    return new VectorInd(
      this.length.subst(name, exp),
      this.target.subst(name, exp),
      this.motive.subst(name, exp),
      this.base.subst(name, exp),
      this.step.subst(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Sem.VectorValue)
    const elem_t = vector_t.elem_t

    const length_core = check(ctx, this.length, new Sem.NatValue())
    const length_value = evaluate(ctx.to_env(), length_core)
    check_conversion(ctx, new Sem.NatValue(), length_value, vector_t.length, {
      description: {
        from: "given length",
        to: "inferred length of Vector",
      },
    })

    const motive_t = vector_ind_motive_t(elem_t)
    const motive_core = check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), motive_core)

    const base_t = Sem.Ap.apply(
      Sem.Ap.apply(motive_value, new Sem.ZeroValue()),
      new Sem.VecnilValue()
    )
    const base_core = check(ctx, this.base, base_t)

    const step_t = vector_ind_step_t(motive_value, elem_t)
    const step_core = check(ctx, this.step, step_t)

    const target_value = evaluate(ctx.to_env(), inferred_target.core)

    return {
      t: Sem.Ap.apply(Sem.Ap.apply(motive_value, length_value), target_value),
      core: new Sem.VectorInd(
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

export function vector_ind_motive_t(elem_t: Value): Value {
  return evaluate(
    new Env().extend("elem_t", elem_t),
    new Sem.Pi(
      "length",
      new Sem.Nat(),
      new Sem.Pi(
        "target_vector",
        new Sem.Vector(new Sem.Var("elem_t"), new Sem.Var("length")),
        new Sem.Type()
      )
    )
  )
}

export function vector_ind_step_t(motive: Value, elem_t: Value): Value {
  return evaluate(
    new Env().extend("motive", motive).extend("elem_t", elem_t),
    new Sem.Pi(
      "length",
      new Sem.Nat(),
      new Sem.Pi(
        "head",
        new Sem.Var("elem_t"),
        new Sem.Pi(
          "tail",
          new Sem.Vector(new Sem.Var("elem_t"), new Sem.Var("length")),
          new Sem.Pi(
            "almost",
            new Sem.Ap(
              new Sem.Ap(new Sem.Var("motive"), new Sem.Var("length")),
              new Sem.Var("tail")
            ),
            new Sem.Ap(
              new Sem.Ap(
                new Sem.Var("motive"),
                new Sem.Add1(new Sem.Var("length"))
              ),
              new Sem.Vec(new Sem.Var("head"), new Sem.Var("tail"))
            )
          )
        )
      )
    )
  )
}
