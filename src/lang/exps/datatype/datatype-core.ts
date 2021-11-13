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

  parameters_alpha_repr(ctx: AlphaCtx): string {
    return "TODO"
  }

  indexes_alpha_repr(ctx: AlphaCtx): string {
    return "TODO"
  }

  ctors_alpha_repr(ctx: AlphaCtx): string {
    return "TODO"
  }
}
