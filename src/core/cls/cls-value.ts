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
  fulfilled: Array<{ name: string; t: Value; value: Value }>
  telescope: Telescope
  name?: string

  constructor(
    fulfilled: Array<{ name: string; t: Value; value: Value }>,
    telescope: Telescope,
    opts?: { name?: string }
  ) {
    this.fulfilled = fulfilled
    this.telescope = telescope
    this.name = opts?.name
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    if (t instanceof TypeValue) {
      const fulfilled = new Array()

      for (const { name, t, value } of this.fulfilled) {
        const t_exp = readback(ctx, new TypeValue(), t)
        const exp = readback(ctx, t, value)
        fulfilled.push({ name, t: t_exp, exp })
        ctx = ctx.extend(name, t, value)
      }

      const demanded = new Array()

      let telescope = this.telescope
      while (telescope.next) {
        const { name, t } = telescope.next
        const t_exp = readback(ctx, new TypeValue(), t)
        demanded.push({ name, t: t_exp })
        ctx.extend(name, t)
        telescope = telescope.fill(new NotYetValue(t, new VarNeutral(name)))
      }

      return new Cls(fulfilled, demanded, { name: this.name })
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    const properties = new Map()

    for (const { name, t, value: fulfilled_value } of this.fulfilled) {
      const property_value = Dot.apply(value, name)
      if (!conversion(ctx, t, property_value, fulfilled_value)) {
        throw new Trace("property_value not equivalent to fulfilled_value")
      }
      const property_exp = readback(ctx, t, property_value)
      properties.set(name, property_exp)
    }

    let telescope = this.telescope
    while (telescope.next) {
      const { name, t } = telescope.next
      const property_value = Dot.apply(value, name)
      const property_exp = readback(ctx, t, property_value)
      properties.set(name, property_exp)
      telescope = telescope.fill(property_value)
    }

    return new Obj(properties)
  }

  dot(target: Value, name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.t
      }
    }

    let telescope = this.telescope
    while (telescope.next !== undefined) {
      if (telescope.next.name !== name) {
        telescope = telescope.fill(Dot.apply(target, telescope.next.name))
      } else {
        return telescope.next.t
      }
    }

    throw new Trace(
      ut.aline(`
        |The property name: ${name} of class is undefined.
        |`)
    )
  }

  apply(arg: Value): Value {
    if (!this.telescope.next) {
      throw new Trace(
        ut.aline(`
          |The telescope is filled.
          |`)
      )
    }

    const fulfilled = [
      ...this.fulfilled,
      { ...this.telescope.next, value: arg },
    ]
    return new ClsValue(fulfilled, this.telescope.fill(arg), {
      name: this.name,
    })
  }
}
