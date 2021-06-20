import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { Env } from "../../env"
import * as Cores from "../../cores"
import * as ut from "../../ut"
import { ClsClosure } from "./cls-closure"

export abstract class Cls2 extends Core {
  instanceofCoresCls2 = true

  abstract evaluate(env: Env): Cores.Cls2Value
  abstract fields_repr(): Array<string>
  abstract fields_alpha_repr(ctx: AlphaCtx): Array<string>
}

export class ClsNil extends Cls2 {
  evaluate(env: Env): Cores.Cls2Value {
    return new Cores.ClsNilValue()
  }

  fields_repr(): Array<string> {
    return []
  }

  repr(): string {
    return `class {}`
  }

  fields_alpha_repr(ctx: AlphaCtx): Array<string> {
    return []
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `class {}`
  }
}

export class ClsCons extends Cls2 {
  field_name: string
  local_name: string
  field_t: Core
  rest_t: Cls2

  constructor(
    field_name: string,
    local_name: string,
    field_t: Core,
    rest_t: Cls2
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t
  }

  evaluate(env: Env): Cores.Cls2Value {
    return new Cores.ClsConsValue(
      this.field_name,
      evaluate(env, this.field_t),
      new ClsClosure(env, this.local_name, this.rest_t)
    )
  }

  fields_repr(): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.repr()}`,
      ...this.rest_t.fields_repr(),
    ]
  }

  repr(): string {
    const fields = this.fields_repr().join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }

  fields_alpha_repr(ctx: AlphaCtx): Array<string> {
    return [
      `${this.field_name}: ${this.field_t.alpha_repr(ctx)}`,
      ...this.rest_t.fields_alpha_repr(ctx.extend(this.local_name)),
    ]
  }

  alpha_repr(ctx: AlphaCtx): string {
    const fields = this.fields_alpha_repr(ctx).join("\n")
    return `class {\n${ut.indent(fields, "  ")}\n}`
  }
}
