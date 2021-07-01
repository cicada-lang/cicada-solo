import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import * as ut from "../../ut"
import { ClsClosure } from "./cls-closure"

export abstract class ClsCore extends Core {
  instanceofExpsCls = true

  abstract append(cls: Exps.ClsCore): Exps.ClsCore
  abstract field_names: Array<string>
  abstract evaluate(env: Env): Exps.ClsValue
  abstract fields_repr(): Array<string>
  abstract fields_alpha_repr(ctx: AlphaCtx): Array<string>
}

export class ClsNilCore extends ClsCore {
  append(cls: Exps.ClsCore): Exps.ClsCore {
    return cls
  }

  get field_names(): Array<string> {
    return []
  }

  evaluate(env: Env): Exps.ClsValue {
    return new Exps.ClsNilValue()
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

export class ClsConsCore extends ClsCore {
  field_name: string
  local_name: string
  field_t: Core
  rest_t: ClsCore

  constructor(
    field_name: string,
    local_name: string,
    field_t: Core,
    rest_t: ClsCore
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t
  }

  append(cls: Exps.ClsCore): Exps.ClsCore {
    return new ClsConsCore(
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
    return new Exps.ClsConsValue(
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
