import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import * as ut from "../../../ut"
import { ClsClosure } from "./cls-closure"

export class FulfilledClsCore extends Exps.ClsCore {
  field_name: string
  local_name: string
  field_t: Core
  field: Core
  rest_t: Exps.ClsCore

  constructor(
    field_name: string,
    local_name: string,
    field_t: Core,
    field: Core,
    rest_t: Exps.ClsCore
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.field = field
    this.rest_t = rest_t
  }

  append(cls: Exps.ClsCore): Exps.ClsCore {
    return new FulfilledClsCore(
      this.field_name,
      this.local_name,
      this.field_t,
      this.field,
      this.rest_t.append(cls)
    )
  }

  get field_names(): Array<string> {
    return [this.field_name, ...this.rest_t.field_names]
  }

  evaluate(env: Env): Exps.ClsValue {
    const field = evaluate(env, this.field)

    return new Exps.FulfilledClsValue(
      this.field_name,
      this.local_name,
      evaluate(env, this.field_t),
      field,
      new ClsClosure(env, this.local_name, this.rest_t).apply(field)
    )
  }

  fields_repr(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.repr()} = ${this.field.repr()}`,
      ...this.rest_t.fields_repr(),
    ]
  }

  repr(): string {
    const fields = this.fields_repr().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  fields_alpha_repr(ctx: AlphaCtx): Array<string> {
    // prettier-ignore
    return [
      `${this.field_name}: ${this.field_t.alpha_repr(ctx)} = ${this.field.alpha_repr(ctx)}`,
      ...this.rest_t.fields_alpha_repr(ctx.extend(this.local_name)),
    ]
  }

  alpha_repr(ctx: AlphaCtx): string {
    const fields = this.fields_alpha_repr(ctx).join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }
}
