import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Obj extends Exp {
  properties: Map<string, Exp>

  constructor(properties: Map<string, Exp>) {
    super()
    this.properties = properties
  }

  check(ctx: Ctx, t: Value): Core {
    if (t instanceof Cores.ClsValue) {
      const cls = t
      cls.telescope.check_properties(ctx, this.properties)
    } else if (t instanceof Cores.ExtValue) {
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
}
