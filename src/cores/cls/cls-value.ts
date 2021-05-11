import { Ctx } from "../../ctx"
import { Core } from "../../core"
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

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      const { entries } = this.telescope.readback(ctx)
      return new Cores.Cls(entries, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    return new Cores.Obj(this.telescope.eta_expand_properties(ctx, value))
  }

  dot_type(target: Value, name: string): Value {
    return this.telescope.dot_type(target, name)
  }

  dot_value(target: Value, name: string): Value {
    return this.telescope.dot_value(target, name)
  }

  apply(arg: Value): Value {
    let telescope = this.telescope
    while (telescope.next) {
      const { value } = telescope.next
      if (value) {
        telescope = telescope.fill(value)
      } else {
        return new Cores.ClsValue(telescope.fill(arg), { name: this.name })
      }
    }

    throw new Trace(
      ut.aline(`
        |The telescope is full.
        |`)
    )
  }

  get names(): Array<string> {
    return this.telescope.names
  }

  extend_ctx(ctx: Ctx, opts?: { prefix?: Core }): Ctx {
    return this.telescope.extend_ctx(ctx, opts)
  }
}
