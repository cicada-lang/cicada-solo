import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Exp } from "../../exp"
import { Value } from "../../value"
import { readback } from "../../readback"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import { Telescope } from "./telescope"
import { Fulfilled } from "./fulfilled"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export class ClsValue extends Value {
  telescope: Telescope
  fulfilled: Fulfilled
  name?: string

  constructor(
    telescope: Telescope,
    opts?: {
      name?: string
      fulfilled?: Fulfilled
    }
  ) {
    super()
    this.telescope = telescope
    this.fulfilled = opts?.fulfilled || new Fulfilled()
    this.name = opts?.name
  }

  check_properties(ctx: Ctx, properties: Map<string, Exp>): Map<string, Core> {
    return new Map([
      ...this.fulfilled.check_properties(ctx, properties),
      ...this.telescope.check_properties(ctx, properties),
    ])
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Cores.TypeValue) {
      const { entries, ctx: next_ctx } = this.fulfilled.readback_aux(ctx, t)
      return new Cores.Cls([...entries, ...this.telescope.readback(next_ctx)], {
        name: this.name,
      })
    }
  }

  eta_expand_properties(ctx: Ctx, value: Value): Map<string, Core> {
    return new Map([
      ...this.fulfilled.eta_expand_properties(ctx, value),
      ...this.telescope.eta_expand_properties(ctx, value),
    ])
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    return new Cores.Obj(this.eta_expand_properties(ctx, value))
  }

  dot_type(target: Value, name: string): Value {
    return (
      this.fulfilled.dot_type(target, name) ||
      this.telescope.dot_type(target, name)
    )
  }

  dot_value(target: Value, name: string): Value {
    return (
      this.fulfilled.dot_value(target, name) ||
      this.telescope.dot_value(target, name)
    )
  }

  apply(arg: Value): Cores.ClsValue {
    const next = this.telescope.next

    if (next === undefined) {
      throw new Trace(
        "I can not apply a value to ClsValue, because the telescope is full"
      )
    }

    if (next.value !== undefined) {
      return new Cores.ClsValue(this.telescope.fill(next.value), {
        name: this.name,
        fulfilled: this.fulfilled.fill_entry(
          next.field_name,
          next.local_name,
          next.t,
          next.value
        ),
      }).apply(arg)
    } else {
      return new Cores.ClsValue(this.telescope.fill(arg), {
        name: this.name,
        fulfilled: this.fulfilled.fill_entry(
          next.field_name,
          next.local_name,
          next.t,
          arg
        ),
      })
    }
  }

  get names(): Array<string> {
    return [...this.fulfilled.names, ...this.telescope.names]
  }

  extend_ctx(ctx: Ctx): Ctx {
    return this.telescope.extend_ctx(this.fulfilled.extend_ctx(ctx))
  }
}
