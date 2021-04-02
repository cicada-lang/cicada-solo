import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Value } from "@/value"
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
