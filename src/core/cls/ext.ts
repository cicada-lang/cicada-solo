import { Exp, AlphaCtx } from "@/exp"
import { Value, match_value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { Telescope } from "@/telescope"
import { Var, ClsValue, ExtValue } from "@/core"
import { TypeValue } from "@/core"
import { evaluate } from "@/evaluate"
import { check } from "@/check"
import { Trace } from "@/trace"
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
    const parent = evaluate(env, new Var(this.parent_name))

    if (parent instanceof ClsValue) {
      return new ExtValue([
        { name: parent.name, telescope: parent.telescope },
        { name: this.name, telescope: new Telescope(env, this.entries) },
      ])
    }

    if (parent instanceof ExtValue) {
      return new ExtValue([
        ...parent.entries,
        { name: this.name, telescope: new Telescope(env, this.entries) },
      ])
    }

    throw new Trace(`Expecting parent to be ClsValue or ExtValue`)
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
