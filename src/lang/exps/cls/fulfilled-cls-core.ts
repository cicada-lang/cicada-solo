import * as ut from "../../../ut"
import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
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

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.field_t.free_names(bound_names),
      ...this.field.free_names(bound_names),
      ...this.rest_t.free_names(new Set([...bound_names, this.local_name])),
    ])
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

  fields_format(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.format()} = ${this.field.format()}`,
      ...this.rest_t.fields_format(),
    ]
  }

  format(): string {
    const fields = this.fields_format().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  fields_alpha_format(ctx: AlphaCtx): Array<string> {
    // prettier-ignore
    return [
      `${this.field_name}: ${this.field_t.alpha_format(ctx)} = ${this.field.alpha_format(ctx)}`,
      ...this.rest_t.fields_alpha_format(ctx.extend(this.local_name)),
    ]
  }

  alpha_format(ctx: AlphaCtx): string {
    const fields = this.fields_alpha_format(ctx).join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }
}
