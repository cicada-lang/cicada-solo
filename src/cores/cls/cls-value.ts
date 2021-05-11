import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import * as Cores from "../../cores"
import { Telescope } from "../../telescope"
import { Trace } from "../../trace"
import * as ut from "../../ut"

export class ClsValue {
  telescope: Telescope
  name?: string

  constructor(telescope: Telescope, opts?: { name?: string }) {
    this.telescope = telescope
    this.name = opts?.name
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return this.telescope.check_properties(ctx, properties)
  }

  readback_aux(
    ctx: Ctx
  ): {
    entries: Array<{ name: string; t: Core; exp?: Core }>
    ctx: Ctx
    values: Map<string, Value>
  } {
    return this.telescope.readback_aux(ctx)
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      const { entries } = this.readback_aux(ctx)
      return new Cores.Cls(entries, { name: this.name })
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return this.telescope.eta_expand_properties(ctx, value)
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    return new Cores.Obj(this.eta_expand_properties(ctx, value))
  }

  dot_type_aux(
    target: Value,
    name: string
  ): {
    t?: Value
    values: Map<string, Value>
  } {
    return this.telescope.dot_type_aux(target, name)
  }

  dot_type(target: Value, name: string): Value {
    const { t } = this.dot_type_aux(target, name)
    if (!t) {
      throw new Trace(
        ut.aline(`
        |In ClsValue, I meet unknown property name: ${name}
        |`)
      )
    }

    return t
  }

  dot_value(target: Value, name: string): Value {
    return this.telescope.dot_value(target, name)
  }

  fulled(): boolean {
    return this.telescope.fulled()
  }

  apply(arg: Value): Cores.ClsValue {
    return new Cores.ClsValue(this.telescope.apply(arg), { name: this.name })
  }

  get names(): Array<string> {
    return this.telescope.names
  }

  extend_ctx(ctx: Ctx): Ctx {
    return this.telescope.extend_ctx(ctx)
  }
}
