import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as ut from "../../../ut"
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
