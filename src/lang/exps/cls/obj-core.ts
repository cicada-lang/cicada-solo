import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ObjCore extends Core {
  properties: Map<string, Core>

  constructor(properties: Map<string, Core>) {
    super()
    this.properties = properties
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set(
      Array.from(this.properties.values()).flatMap((property) =>
        Array.from(property.free_names(bound_names)),
      ),
    )
  }

  evaluate(env: Env): Value {
    const properties = new Map()

    for (const [name, exp] of this.properties) {
      properties.set(name, evaluate(env, exp))
    }

    return new Exps.ObjValue(properties)
  }

  format(): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.format()}`)
      .join(", ")
    return `{ ${s} }`
  }

  alpha_format(ctx: AlphaCtx): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.alpha_format(ctx)}`)
      .join(", ")
    return `{ ${s} }`
  }
}
