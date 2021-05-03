import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Trace } from "../../trace"
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
      const core_properties = cls.telescope.check_properties(
        ctx,
        this.properties
      )
      return new Cores.Obj(core_properties)
    }

    if (t instanceof Cores.ExtValue) {
      const ext = t
      let core_properties: Map<string, Core> = new Map()
      for (const { telescope } of ext.entries) {
        core_properties = new Map([
          ...core_properties,
          ...telescope.check_properties(ctx, this.properties),
        ])
      }

      return new Cores.Obj(core_properties)
    }

    throw new Trace(`Expecting t to be ClsValue or ExtValue`)
  }

  repr(): string {
    const s = Array.from(this.properties)
      .map(([name, exp]) => `${name}: ${exp.repr()}`)
      .join("\n")
    return `{\n${ut.indent(s, "  ")}\n}`
  }
}
