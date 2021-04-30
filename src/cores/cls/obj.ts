import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { ClsValue, ExtValue, ObjValue, TypeValue } from "../../cores"
import { evaluate } from "../../evaluate"
import * as ut from "../../ut"

export class Obj implements Core {
  properties: Map<string, Core>

  constructor(properties: Map<string, Core>) {
    this.properties = properties
  }

  evaluate(ctx: Ctx, env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(ctx, env, exp))
    }

    return new ObjValue(properties)
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
