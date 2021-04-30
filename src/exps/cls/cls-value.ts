import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { Cls, Obj, TypeValue } from "../../cores"
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

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      const { entries } = this.telescope.readback(ctx)
      return new Cls(entries, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    return new Obj(this.telescope.eta_expand_properties(ctx, value))
  }

  dot(target: Value, name: string): Value {
    return this.telescope.dot(target, name)
  }

  apply(arg: Value): Value {
    let telescope = this.telescope
    while (telescope.next) {
      const { value } = telescope.next
      if (value) {
        telescope = telescope.fill(value)
      } else {
        return new ClsValue(telescope.fill(arg), { name: this.name })
      }
    }

    throw new Trace(
      ut.aline(`
        |The telescope is full.
        |`)
    )
  }

  extend_ctx(ctx: Ctx): Ctx {
    return this.telescope.extend_ctx(ctx)
  }
}
