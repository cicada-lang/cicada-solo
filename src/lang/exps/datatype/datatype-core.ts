import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import * as ut from "../../../ut"

export class DatatypeCore extends Core {
  name: string
  parameters: Record<string, Core>
  indexes: Record<string, Core>
  ctors: Record<string, Core>

  constructor(
    name: string,
    parameters: Record<string, Core>,
    indexes: Record<string, Core>,
    ctors: Record<string, Core>
  ) {
    super()
    this.name = name
    this.parameters = parameters
    this.indexes = indexes
    this.ctors = ctors
  }

  evaluate(env: Env): Value {
    return new Exps.DatatypeValue(
      this.name,
      this.parameters,
      this.indexes,
      this.ctors,
      env
    )
  }

  repr(): string {
    return this.name
  }

  alpha_repr(ctx: AlphaCtx): string {
    const p = this.parameters_alpha_repr(ctx)
    const i = this.indexes_alpha_repr(ctx)
    // NOTE structural typing (do not print `name`)
    const head = `datatype # ${p}${i}`
    const c = this.ctors_alpha_repr(ctx.extend(this.name))
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private parameters_alpha_repr(ctx: AlphaCtx): string {
    if (Object.entries(this.parameters).length > 0) {
      return (
        "(" +
        Object.entries(this.parameters)
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
