import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value, Subst } from "../../value"
import { evaluate } from "../../core"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class ObjCore extends Core {
  properties: Map<string, Core>

  constructor(properties: Map<string, Core>) {
    super()
    this.properties = properties
  }

  evaluate(env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(env, exp))
    }

    return new Exps.ObjValue(properties)
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
