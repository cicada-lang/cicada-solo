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
  fulfilled: Array<{ name: string; t: Value; value: Value }>

  constructor(
    env: Env,
    entries: Array<{ name: string; t: Core; exp?: Core }>,
    fulfilled?: Array<{ name: string; t: Value; value: Value }>
  ) {
    this.env = env
    this.entries = entries
    this.fulfilled = fulfilled || []
  }

  env_extend_by_values(values: Map<string, Value>): Telescope {
    return new Telescope(
      this.env.extend_by_values(values),
      this.entries,
      this.fulfilled
    )
  }

  env_extend(name: string, value: Value): Telescope {
    return new Telescope(
      this.env.extend(name, value),
      this.entries,
      this.fulfilled
    )
  }

  get names(): Array<string> {
    return [
      ...this.fulfilled.map((entry) => entry.name),
      ...this.entries.map((entry) => entry.name),
    ]
  }

  get next(): undefined | { name: string; t: Value; value?: Value } {
    if (this.entries.length === 0) return undefined

    const [{ name, t, exp }] = this.entries
    evaluate(this.env, t)
    return {
      name,
      t: evaluate(this.env, t),
      value: exp ? evaluate(this.env, exp) : undefined,
    }
  }

  fulled(): boolean {
    let telescope: Telescope = this
    while (telescope.next) {
      const { value } = telescope.next
      if (value) {
        telescope = telescope.fill(value)
      } else {
        return false
      }
    }

    return true
  }

  apply(arg: Value): Telescope {
    let telescope: Telescope = this
    while (telescope.next) {
      const { value } = telescope.next
      if (value) {
        telescope = telescope.fill(value)
      } else {
        return telescope.fill(arg)
      }
    }

    throw new Trace(
      ut.aline(`
        |The telescope is full.
        |`)
    )
  }

  fill(value: Value): Telescope {
    if (!this.next) {
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
      this.entries.slice(1),
      [
        ...this.fulfilled,
        {
          name: this.next.name,
          t: this.next.t,
          value,
        },
      ]
    )
  }

  dot_type_aux(
    target: Value,
    name: string
  ): {
    t?: Value
    values: Map<string, Value>
  } {
    const values: Map<string, Value> = new Map()

    for (const entry of this.fulfilled) {
      values.set(entry.name, entry.value)
      if (entry.name === name) {
        return { t: entry.t, values }
      }
    }

    let telescope: Telescope = this
    while (telescope.next) {
      const next = telescope.next
      if (next.value) {
        values.set(next.name, next.value)
      }
      if (next.name !== name) {
        const value = Cores.Dot.apply(target, next.name)
        if (!next.value) {
          values.set(next.name, value)
        }
        telescope = telescope.fill(value)
      } else {
        return { t: next.t, values }
      }
    }

    return { values }
  }

  dot_value(target: Value, name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.value
      }
    }

    let telescope: Telescope = this
    while (telescope.next) {
      const { name: next_name, t } = telescope.next
      if (next_name !== name) {
        telescope = telescope.fill(Cores.Dot.apply(target, next_name))
      } else {
        return Cores.Dot.apply(target, next_name)
      }
    }

    throw new Trace(
      ut.aline(`
        |The property name: ${name} of class is undefined.
        |`)
    )
  }

  readback_aux(
    ctx: Ctx
  ): {
    entries: Array<{ name: string; t: Core; exp?: Core }>
    ctx: Ctx
    values: Map<string, Value>
  } {
    const entries = []
    const values: Map<string, Value> = new Map()

    for (const { name, t, value } of this.fulfilled) {
      const t_exp = readback(ctx, new Cores.TypeValue(), t)
      const exp = readback(ctx, t, value)
      entries.push({ name, t: t_exp, exp })
      values.set(name, value)
      ctx = ctx.extend(name, t, value)
    }

    let telescope: Telescope = this
    while (telescope.next) {
      const { name, t, value } = telescope.next
      const t_exp = readback(ctx, new Cores.TypeValue(), t)
      if (value) {
        entries.push({ name, t: t_exp, exp: readback(ctx, t, value) })
        values.set(name, value)
        ctx = ctx.extend(name, t, value)
        telescope = telescope.fill(value)
      } else {
        entries.push({ name, t: t_exp })
        const value = new Cores.NotYetValue(t, new Cores.VarNeutral(name))
        values.set(name, value)
        ctx = ctx.extend(name, t)
        telescope = telescope.fill(value)
      }
    }

    return { entries, ctx, values }
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

    const core_properties: Map<string, Core> = new Map()

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
      core_properties.set(name, core)
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
      core_properties.set(name, core)

      if (value) {
        const found_value = evaluate(ctx.to_env(), core)
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

      telescope = telescope.fill(evaluate(ctx.to_env(), core))
    }

    return core_properties
  }

  extend_ctx(ctx: Ctx): Ctx {
    for (const { name, t, value } of this.fulfilled) {
      ctx = ctx.extend(name, t, value)
    }
    for (const { name, t, exp } of this.entries) {
      const env = ctx.to_env()
      if (exp) {
        ctx = ctx.extend(name, evaluate(env, t), evaluate(env, exp))
      } else {
        const dot = evaluate(env, new Cores.Dot(new Cores.Var("this"), name))
        ctx = ctx.extend(name, evaluate(env, t), dot)
      }
    }
    return ctx
  }
}
