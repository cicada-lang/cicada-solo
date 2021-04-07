import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { ClsValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import * as ut from "@/ut"

export class Ext implements Exp {
  name?: string
  parent_name: string
  entries: Array<{ name: string; t: Exp; exp?: Exp }>

  constructor(
    parent_name: string,
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    this.parent_name = parent_name
    this.entries = entries
    this.name = opts?.name
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
