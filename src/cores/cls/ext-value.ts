import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Telescope } from "../../telescope"
import { Trace } from "../../trace"
import { evaluate } from "../../evaluate"
import * as ut from "../../ut"
import * as Cores from "../../cores"

// NOTE `Ext` can not evaluate to `ClsValue`,
//   because we need lexical scope,
//   we need to use `ExtValue` to chain `ClsValue`.

export class ExtValue {
  parent: Cores.ExtValue | Cores.ClsValue
  telescope: Telescope
  name?: string

  constructor(
    parent: Cores.ExtValue | Cores.ClsValue,
    telescope: Telescope,
    opts?: { name?: string }
  ) {
    this.parent = parent
    this.telescope = telescope
    this.name = opts?.name
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return new Map([
      ...this.parent.check_properties(ctx, properties),
      ...this.telescope.check_properties(ctx, properties),
    ])
  }

  readback_aux(
    ctx: Ctx
  ): {
    entries: Array<{ name: string; t: Core; exp?: Core }>
    ctx: Ctx
    values: Map<string, Value>
  } {
    const pre = this.parent.readback_aux(ctx)
    const self = this.telescope
      .env_extend_by_values(pre.values)
      .readback_aux(pre.ctx)

    return {
      entries: [...pre.entries, ...self.entries],
      values: new Map([...pre.values, ...self.values]),
      ctx: self.ctx,
    }
  }

  // NOTE ExtValue should be readback to Cls instead of Ext.
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      const { entries } = this.readback_aux(ctx)
      return new Cores.Cls(entries, { name: this.name })
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return new Map([
      ...this.parent.eta_expand_properties(ctx, value),
      ...this.telescope.eta_expand_properties(ctx, value),
    ])
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
    const pre = this.parent.dot_type_aux(target, name)
    if (pre.t) return pre

    return this.telescope
      .env_extend_by_values(pre.values)
      .dot_type_aux(target, name)
  }

  dot_type(target: Value, name: string): Value {
    const { t } = this.dot_type_aux(target, name)
    if (!t) {
      throw new Trace(
        ut.aline(`
        |In ExtValue, I meet unknown property name: ${name}
        |`)
      )
    }

    return t
  }

  dot_value(target: Value, name: string): Value {
    try {
      return this.parent.dot_value(target, name)
    } catch (error) {
      return this.telescope.dot_value(target, name)
    }
  }

  fulled(): boolean {
    return this.parent.fulled() && this.telescope.fulled()
  }

  apply(arg: Value): Cores.ExtValue {
    if (!this.parent.fulled()) {
      return new Cores.ExtValue(this.parent.apply(arg), this.telescope, {
        name: this.name,
      })
    } else {
      return new Cores.ExtValue(this.parent, this.telescope.apply(arg), {
        name: this.name,
      })
    }
  }

  get names(): Array<string> {
    return [...this.parent.names, ...this.telescope.names]
  }

  extend_ctx(ctx: Ctx): Ctx {
    return this.telescope.extend_ctx(this.parent.extend_ctx(ctx))
  }
}
