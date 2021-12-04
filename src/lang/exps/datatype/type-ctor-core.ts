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
  varied: Record<string, Core>
  data_ctors: Record<string, Core>

  constructor(
    name: string,
    fixed: Record<string, Core>,
    varied: Record<string, Core>,
    data_ctors: Record<string, Core>
  ) {
    super()
    this.name = name
    this.fixed = fixed
    this.varied = varied
    this.data_ctors = data_ctors
  }

  evaluate(env: Env): Value {
    return new Exps.TypeCtorValue(
      this.name,
      this.fixed,
      this.varied,
      this.data_ctors,
      env
    )
  }

  format(): string {
    return this.name
  }

  alpha_format(ctx: AlphaCtx): string {
    const p = this.fixed_alpha_format(ctx)
    const i = this.varied_alpha_format(ctx)
    // NOTE structural typing (do not print `name`)
    const head = `datatype # ${p}${i}`
    const c = this.data_ctors_alpha_format(ctx.extend(this.name))
    const body = ut.indent(c, "  ")
    return `${head}{\n${body}\n}`
  }

  private fixed_alpha_format(ctx: AlphaCtx): string {
    if (Object.entries(this.fixed).length > 0) {
      return (
        "(" +
        Object.entries(this.fixed)
          .map(([name, t]) => `${name}: ${t.alpha_format(ctx)}`)
          .join(", ") +
        ") "
      )
    } else if (Object.entries(this.varied).length > 0) {
      return "() "
    } else {
      return ""
    }
  }

  private varied_alpha_format(ctx: AlphaCtx): string {
    if (Object.entries(this.varied).length > 0) {
      return (
        "(" +
        Object.entries(this.varied)
          .map(([name, t]) => `${name}: ${t.alpha_format(ctx)}`)
          .join(", ") +
        ") "
      )
    } else {
      return ""
    }
  }

  private data_ctors_alpha_format(ctx: AlphaCtx): string {
    return Object.entries(this.data_ctors)
      .map(([name, t]) => `${name}: ${t.alpha_format(ctx)}`)
      .join("\n")
  }
}
