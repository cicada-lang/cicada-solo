import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import * as Cores from "../../cores"

export class VectorInd extends Core {
  length: Core
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(
    length: Core,
    target: Core,
    motive: Core,
    base: Core,
    step: Core
  ) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    return VectorInd.apply(
      evaluate(env, this.length),
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
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

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.length.alpha_repr(ctx),
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `vector_ind(${args})`
  }

  static apply(
    length: Value,
    target: Value,
    motive: Value,
    base: Value,
    step: Value
  ): Value {
    throw new Error("TODO")
  }
}
