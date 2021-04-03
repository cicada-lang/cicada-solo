import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value, match_value } from "@/value"
import { ClsValue, ObjValue, TypeValue } from "@/core"
import { DotNeutral, NotYetValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { infer } from "@/infer"
import { conversion } from "@/conversion"
import { readback } from "@/readback"
import { expect } from "@/expect"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class Dot implements Exp {
  target: Exp
  name: string

  constructor(target: Exp, name: string) {
    this.target = target
    this.name = name
  }

  evaluate(env: Env): Value {
    return Dot.apply(evaluate(env, this.target), this.name)
  }

  static apply(target: Value, name: string): Value {
    return match_value(target, {
      ObjValue: (obj: ObjValue) => obj.dot(this.name),
      ClsValue: (cls: ClsValue) => cls.dot(this.name),
      NotYetValue: ({ t, neutral }: NotYetValue) =>
        match_value(t, {
          ClsValue: (cls: ClsValue) =>
            new NotYetValue(
              cls.dot(this.name),
              new DotNeutral(neutral, this.name)
            ),
        }),
    })
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)

    if (target_t instanceof ClsValue) {
      return target_t.dot(this.name)
    }

    throw new Trace(
      ut.aline(`
        |Expecting target type to be a class.
        |  ${ut.inspect(target_t)}
        |`)
    )
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
