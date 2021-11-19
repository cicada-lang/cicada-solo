import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import * as ut from "../../../ut"
import { ClsClosure } from "./cls-closure"

export class ConsClsCore extends Exps.ClsCore {
  field_name: string
  local_name: string
  field_t: Core
  rest_t: Exps.ClsCore

  constructor(
    field_name: string,
    local_name: string,
    field_t: Core,
    rest_t: Exps.ClsCore
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t
  }

  append(cls: Exps.ClsCore): Exps.ClsCore {
    return new ConsClsCore(
      this.field_name,
      this.local_name,
      this.field_t,
      this.rest_t.append(cls)
    )
  }

  get field_names(): Array<string> {
    return [this.field_name, ...this.rest_t.field_names]
  }

  evaluate(env: Env): Exps.ClsValue {
    return new Exps.ConsClsValue(
      this.field_name,
      evaluate(env, this.field_t),
      new ClsClosure(env, this.local_name, this.rest_t)
    )
  }

  fields_format(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.format()}`,
      ...this.rest_t.fields_format(),
    ]
  }

  format(): string {
    const fields = this.fields_format().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  fields_alpha_format(ctx: AlphaCtx): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.alpha_format(ctx)}`,
      ...this.rest_t.fields_alpha_format(ctx.extend(this.local_name)),
    ]
  }

  alpha_format(ctx: AlphaCtx): string {
    const fields = this.fields_alpha_format(ctx).join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }
}
