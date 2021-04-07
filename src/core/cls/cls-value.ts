import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Cls, Obj, Dot, TypeValue } from "@/core"
import { NotYetValue, VarNeutral } from "@/core"
import { Telescope } from "@/telescope"
import { readback } from "@/readback"
import { conversion } from "@/conversion"
import { Trace } from "@/trace"
import * as ut from "@/ut"

export class ClsValue {
  telescope: Telescope
  name?: string

  constructor(telescope: Telescope, opts?: { name?: string }) {
    this.telescope = telescope
    this.name = opts?.name
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      const entries = new Array()

      for (const { name, t, value } of this.telescope.fulfilled) {
        const t_exp = readback(ctx, new TypeValue(), t)
        const exp = readback(ctx, t, value)
        entries.push({ name, t: t_exp, exp })
        ctx = ctx.extend(name, t, value)
      }

      let telescope = this.telescope
      while (telescope.next) {
        const { name, t, value } = telescope.next
        const t_exp = readback(ctx, new TypeValue(), t)
        if (value) {
          entries.push({ name, t: t_exp, exp: readback(ctx, t, value) })
          ctx = ctx.extend(name, t, value)
          telescope = telescope.fill(new NotYetValue(t, new VarNeutral(name)))
        } else {
          entries.push({ name, t: t_exp })
          ctx = ctx.extend(name, t)
          telescope = telescope.fill(new NotYetValue(t, new VarNeutral(name)))
        }
      }

      return new Cls(entries, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    const properties = new Map()

    for (const entry of this.telescope.fulfilled) {
      const { name, t, value: fulfilled_value } = entry
      const property_value = Dot.apply(value, name)
      if (!conversion(ctx, t, property_value, fulfilled_value)) {
        throw new Trace("property_value not equivalent to fulfilled_value")
      }
      const property_exp = readback(ctx, t, property_value)
      properties.set(name, property_exp)
    }

    let telescope = this.telescope
    while (telescope.next) {
      const { name, t, value: fulfilled_value } = telescope.next
      if (fulfilled_value) {
        const property_value = Dot.apply(value, name)
        if (!conversion(ctx, t, property_value, fulfilled_value)) {
          throw new Trace("property_value not equivalent to fulfilled_value")
        }
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      } else {
        const property_value = Dot.apply(value, name)
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      }
    }

    return new Obj(properties)
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
}
