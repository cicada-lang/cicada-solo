import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { ClsValue, ExtValue, ObjValue, TypeValue } from "../../core"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { conversion } from "../../conversion"
import { readback } from "../../readback"
import { expect } from "../../expect"
import { Trace } from "../../trace"
import { Telescope } from "../../telescope"
import * as ut from "../../ut"

export class Obj implements Exp {
  properties: Map<string, Exp>

  constructor(properties: Map<string, Exp>) {
    this.properties = properties
  }

  evaluate(env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(env, exp))
    }

    return new ObjValue(properties)
  }

  check(ctx: Ctx, t: Value): void {
    if (t instanceof ClsValue) {
      const cls = t
      cls.telescope.check_properties(ctx, this.properties)
    } else if (t instanceof ExtValue) {
      const ext = t
      for (const { telescope } of ext.entries) {
        telescope.check_properties(ctx, this.properties)
      }
    }
  }

  repr(): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.repr()}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.alpha_repr(ctx)}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}
