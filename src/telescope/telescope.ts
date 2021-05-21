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
      if (this.next.value !== undefined) {
        const exp = readback(ctx, this.next.t, this.next.value)
        const entry = { name: this.next.name, t, exp }
        return this.fill(this.next.value).readback_aux(
          ctx.extend(this.next.name, this.next.t, this.next.value),
          [...entries, entry]
        )
      } else {
        const entry = { name: this.next.name, t }
        const v = new Cores.VarNeutral(this.next.name)
        const value = new Cores.NotYetValue(this.next.t, v)
        return this.fill(value).readback_aux(
          ctx.extend(this.next.name, this.next.t),
          [...entries, entry]
        )
      }
    }
  }

  readback(ctx: Ctx): Array<{ name: string; t: Core; exp?: Core }> {
    return this.readback_aux(ctx, new Array())
  }

  eta_expand_properties_aux(
    ctx: Ctx,
    value: Value,
    properties: Map<string, Core>
  ): Map<string, Core> {
    if (this.next === undefined) {
      return properties
    } else {
      if (this.next.value !== undefined) {
        const property_value = Cores.Dot.apply(value, this.next.name)

        check_conversion(ctx, this.next.t, property_value, this.next.value, {
          description: {
            from: "the property value",
            to: "the next value in telescope",
          },
        })

        return this.fill(property_value).eta_expand_properties_aux(
          ctx,
          value,
          new Map([
            ...properties,
            [this.next.name, readback(ctx, this.next.t, property_value)],
          ])
        )
      } else {
        const property_value = Cores.Dot.apply(value, this.next.name)
        return this.fill(property_value).eta_expand_properties_aux(
          ctx,
          value,
          new Map([
            ...properties,
            [this.next.name, readback(ctx, this.next.t, property_value)],
          ])
        )
      }
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return this.eta_expand_properties_aux(ctx, value, new Map())
  }

  check_properties_aux(
    ctx: Ctx,
    properties: Map<string, Exp>,
    cores: Map<string, Core>
  ): Map<string, Core> {
    // NOTE We DO NOT need to update the `ctx` as we go along.
    // - the bindings in telescope will not effect current ctx.
    // - just like checking `cons`.

    if (this.next === undefined) {
      return cores
    } else {
      const found = properties.get(this.next.name)
      if (found === undefined) {
        throw new Trace(`Can not found next name: ${this.next.name}`)
      }
      const found_core = check(ctx, found, this.next.t)
      const found_value = evaluate(ctx.to_env(), found_core)
      if (this.next.value !== undefined) {
        check_conversion(ctx, this.next.t, this.next.value, found_value, {
          description: {
            from: "the value in partially filled class",
            to: "the value in object",
          },
        })
      }

      return this.fill(found_value).check_properties_aux(
        ctx,
        properties,
        new Map([...cores, [this.next.name, found_core]])
      )
    }
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return this.check_properties_aux(ctx, properties, new Map())
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

function check_conversion(
  ctx: Ctx,
  t: Value,
  from: Value,
  to: Value,
  opts: {
    description?: {
      from: string
      to: string
    }
  }
): void {
  if (!conversion(ctx, t, from, to)) {
    const t_repr = readback(ctx, new Cores.TypeValue(), t).repr()
    const from_repr = readback(ctx, t, from).repr()
    const from_description = opts.description?.from || ""
    const to_repr = readback(ctx, t, to).repr()
    const to_description = opts.description?.to || ""
    throw new Trace(
      ut.aline(`
        |I am expecting the following two values to be the same ${t_repr}.
        |But they are not.
        |from ${from_description}:
        |  ${from_repr}
        |to ${from_description}:
        |  ${to_repr}
        |`)
    )
  }
}
