import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value, match_value } from "@/value"
import { ClsValue, ObjValue, TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
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
    throw new Error("TODO")
  }

  static apply(target: Value, name: string): Value {
    throw new Error("TODO")

    // return match_value(target, {
    //   ObjValue: (fn: FnValue) => ...,
    //   NotYetValue: ({ t, neutral }: NotYetValue) =>
    //     match_value(t, {
    //       PiValue: (pi: PiValue) =>
    //         new NotYetValue(
    //           pi.ret_t_cl.apply(arg),
    //           new ApNeutral(neutral, new Normal(pi.arg_t, arg))
    //         ),
    //     }),
    // })
  }

  infer(ctx: Ctx): Value {
    throw new Error("TODO")
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}
