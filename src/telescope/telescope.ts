import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp } from "../exp"
import { Core } from "../core"
import { Value } from "../value"
import { conversion } from "../conversion"
import { readback } from "../readback"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { Trace } from "../trace"
import * as Cores from "../cores"
import * as ut from "../ut"

export class Telescope {
  env: Env
  entries: Array<{ name: string; t: Core; exp?: Core }>
  next?: { name: string; t: Value; value?: Value }

  constructor(env: Env, entries: Array<{ name: string; t: Core; exp?: Core }>) {
    this.env = env
    this.entries = entries

    if (this.entries.length === 0) {
      this.next = undefined
    } else {
      const [{ name, t, exp }] = this.entries
      this.next = {
        name,
        t: evaluate(this.env, t),
        value: exp ? evaluate(this.env, exp) : undefined,
      }
    }
  }

  get names(): Array<string> {
    return this.entries.map((entry) => entry.name)
  }

  fill(value: Value): Telescope {
    if (this.next === undefined) {
      throw new Trace(
        ut.aline(`
          |Filling fulled telescope.
          |- telescope: ${ut.inspect(this)}
          |- value: ${ut.inspect(value)}
          |`)
      )
    }

    return new Telescope(
      this.env.extend(this.next.name, value),
      this.entries.slice(1)
    )
  }

  dot_type(target: Value, name: string): Value {
    if (this.next === undefined) {
      throw new Trace(
        ut.aline(`
        |In Telescope, I meet unknown property name: ${name}
        |`)
      )
    } else {
      if (this.next.name === name) {
        return this.next.t
      } else {
        const value = Cores.Dot.apply(target, this.next.name)
        return this.fill(value).dot_type(target, name)
      }
    }
  }

  dot_value(target: Value, name: string): Value {
    if (this.next === undefined) {
      throw new Trace(
        ut.aline(`
        |The property name: ${name} of class is undefined.
        |`)
      )
    } else {
      if (this.next.name === name) {
        return Cores.Dot.apply(target, this.next.name)
      } else {
        const value = Cores.Dot.apply(target, this.next.name)
        return this.fill(value).dot_value(target, name)
      }
    }
  }

  readback_aux(
    ctx: Ctx,
    entries: Array<{ name: string; t: Core; exp?: Core }>
  ): Array<{ name: string; t: Core; exp?: Core }> {
    if (this.next === undefined) {
      return entries
    } else {
      const t = readback(ctx, new Cores.TypeValue(), this.next.t)
      if (this.next.value === undefined) {
        const entry = { name: this.next.name, t }
        const v = new Cores.VarNeutral(this.next.name)
        const value = new Cores.NotYetValue(this.next.t, v)
        return this.fill(value).readback_aux(
          ctx.extend(this.next.name, this.next.t),
          [...entries, entry]
        )
      } else {
        const exp = readback(ctx, this.next.t, this.next.value)
        const entry = { name: this.next.name, t, exp }
        return this.fill(this.next.value).readback_aux(
          ctx.extend(this.next.name, this.next.t, this.next.value),
          [...entries, entry]
        )
      }
    }
  }

  readback(ctx: Ctx): Array<{ name: string; t: Core; exp?: Core }> {
    return this.readback_aux(ctx, new Array())
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    const properties = new Map()

    let telescope: Telescope = this
    while (telescope.next) {
      const { name, t, value: fulfilled_value } = telescope.next
      if (fulfilled_value) {
        const property_value = Cores.Dot.apply(value, name)
        if (!conversion(ctx, t, property_value, fulfilled_value)) {
          throw new Trace("property_value not equivalent to fulfilled_value")
        }
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      } else {
        const property_value = Cores.Dot.apply(value, name)
        const property_exp = readback(ctx, t, property_value)
        properties.set(name, property_exp)
        telescope = telescope.fill(property_value)
      }
    }

    return properties
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    // NOTE We DO NOT need to update the `ctx` as we go along.
    // - the bindings in telescope will not effect current ctx.
    // - just like checking `cons`.

    const cores: Map<string, Core> = new Map()

    let telescope: Telescope = this
    while (telescope.next) {
      const { name, t: next_t, value } = telescope.next

      const found = properties.get(name)
      if (found === undefined) {
        throw new Trace(
          ut.aline(`
          |Can not found next name: ${name}
          |`)
        )
      }

      const core = check(ctx, found, next_t)
      cores.set(name, core)
      const found_value = evaluate(ctx.to_env(), core)
      if (value) {
        if (!conversion(ctx, next_t, value, found_value)) {
          const t_repr = readback(ctx, new Cores.TypeValue(), next_t).repr()
          const value_repr = readback(ctx, next_t, value).repr()
          const found_repr = readback(ctx, next_t, found_value).repr()
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

      telescope = telescope.fill(found_value)
    }

    return cores
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { name, t, exp } of this.entries) {
      const env = ctx.to_env()
      if (exp) {
        ctx = ctx.extend(name, evaluate(env, t), evaluate(env, exp))
      } else {
        ctx = ctx.extend(name, evaluate(env, t))
      }
    }
    return ctx
  }
}
