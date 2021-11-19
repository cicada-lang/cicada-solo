import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class TypeCtorCore extends Core {
  name: string
  fixed: Record<string, Core>
  indexes: Record<string, Core>
  ctors: Record<string, Core>

  constructor(
    name: string,
    fixed: Record<string, Core>,
    indexes: Record<string, Core>,
    ctors: Record<string, Core>
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.indexes = indexes
    this.ctors = ctors
  }

  evaluate(env: Env): Value {
    return new Exps.TypeCtorValue(
      this.name,
      this.fixed,
      this.indexes,
      this.ctors,
      env
    )
  }

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const p = this.fixed_alpha_repr(ctx)
    const i = this.indexes_alpha_repr(ctx)
    // NOTE structural typing (do not print `name`)
    const head = `datatype # ${p}${i}`
    const c = this.ctors_alpha_repr(ctx.extend(this.name))
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private fixed_alpha_repr(ctx: AlphaCtx): string {
    if (Object.entries(this.fixed).length > 0) {
      return (
        "(" +
        Object.entries(this.fixed)
          .map(([name, t]) => `${name}: ${t.alpha_repr(ctx)}`)
          .join(", ") +
        ") "
      )
    } else if (Object.entries(this.indexes).length > 0) {
      return "() "
    } else {
      return ""
    }
  }

  private indexes_alpha_repr(ctx: AlphaCtx): string {
    if (Object.entries(this.indexes).length > 0) {
      return (
        "(" +
        Object.entries(this.indexes)
          .map(([name, t]) => `${name}: ${t.alpha_repr(ctx)}`)
          .join(", ") +
        ") "
      )
    } else {
      return ""
    }
  }

  private ctors_alpha_repr(ctx: AlphaCtx): string {
    return Object.entries(this.ctors)
      .map(([name, t]) => `${name}: ${t.alpha_repr(ctx)}`)
      .join("\n")
  }
}
