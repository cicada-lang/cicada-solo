import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { Telescope } from "../../telescope"
import { readback } from "../../readback"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class ClsValue {
  telescope: Telescope
  fulfilled: Array<{ name: string; t: Value; value: Value }>
  name?: string

  constructor(
    telescope: Telescope,
    opts?: {
      name?: string
      fulfilled?: Array<{ name: string; t: Value; value: Value }>
    }
  ) {
    this.telescope = telescope
    this.fulfilled = opts?.fulfilled || new Array()
    this.name = opts?.name
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    const cores: Map<string, Core> = new Map()

    for (const { name, t, value } of this.fulfilled) {
      const found = properties.get(name)

      if (found === undefined) {
        throw new Trace(
          ut.aline(`
            |Can not found satisfied entry name: ${name}
            |`)
        )
      }

      const core = check(ctx, found, t)
      cores.set(name, core)
      const found_value = evaluate(ctx.to_env(), core)

      if (!conversion(ctx, t, value, found_value)) {
        const t_repr = readback(ctx, new Cores.TypeValue(), t).repr()
        const value_repr = readback(ctx, t, value).repr()
        const found_repr = readback(ctx, t, found_value).repr()
        throw new Trace(
          ut.aline(`
          |I am expecting the following two values to be the same ${t_repr}.
          |But they are not.
          |The value in object:
          |  ${value_repr}
          |The value in partially filled class:
          |  ${found_repr}
          |`)
        )
      }
    }

    return new Map([
      ...cores,
      ...this.telescope.check_properties(ctx, properties),
    ])
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    const entries: Array<{ name: string; t: Core; exp?: Core }> = []

    for (const { name, t, value } of this.fulfilled) {
      const t_exp = readback(ctx, new Cores.TypeValue(), t)
      const exp = readback(ctx, t, value)
      entries.push({ name, t: t_exp, exp })
      ctx = ctx.extend(name, t, value)
    }

    if (t instanceof Cores.TypeValue) {
      return new Cores.Cls([...entries, ...this.telescope.readback(ctx)], {
        name: this.name,
      })
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    const properties = new Map()

    for (const { name, t, value: fulfilled_value } of this.fulfilled) {
      const property_value = Cores.Dot.apply(value, name)
      if (!conversion(ctx, t, property_value, fulfilled_value)) {
        throw new Trace("property_value not equivalent to fulfilled_value")
      }
      const property_exp = readback(ctx, t, property_value)
      properties.set(name, property_exp)
    }

    return new Map([
      ...properties,
      ...this.telescope.eta_expand_properties(ctx, value),
    ])
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    return new Cores.Obj(this.eta_expand_properties(ctx, value))
  }

  dot_type(target: Value, name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.t
      }
    }

    return this.telescope.dot_type(target, name)
  }

  dot_value(target: Value, name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.value
      }
    }

    return this.telescope.dot_value(target, name)
  }

  apply(arg: Value): Cores.ClsValue {
    const next = this.telescope.next

    if (next === undefined) {
      throw new Trace(
        "I can not apply a value to ClsValue, because the telescope is full"
      )
    }

    if (next.value !== undefined) {
      const entry = { name: next.name, t: next.t, value: next.value }
      return new Cores.ClsValue(this.telescope.fill(next.value), {
        name: this.name,
        fulfilled: [...this.fulfilled, entry],
      }).apply(arg)
    } else {
      const entry = { name: next.name, t: next.t, value: arg }
      return new Cores.ClsValue(this.telescope.fill(arg), {
        name: this.name,
        fulfilled: [...this.fulfilled, entry],
      })
    }
  }

  get names(): Array<string> {
    return [
      ...this.fulfilled.map((entry) => entry.name),
      ...this.telescope.names,
    ]
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { name, t, value } of this.fulfilled) {
      ctx = ctx.extend(name, t, value)
    }

    return this.telescope.extend_ctx(ctx)
  }
}
