import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Env } from "../../env"
import * as Sem from "../../sem"
import * as ut from "../../ut"
import { ClsClosure } from "./cls-closure"

export abstract class Cls extends Core {
  instanceofSemCls = true

  abstract append(cls: Sem.Cls): Sem.Cls
  abstract field_names: Array<string>
  abstract evaluate(env: Env): Sem.ClsValue
  abstract fields_repr(): Array<string>
  abstract fields_alpha_repr(ctx: AlphaCtx): Array<string>
}

export class ClsNil extends Cls {
  append(cls: Sem.Cls): Sem.Cls {
    return cls
  }

  get field_names(): Array<string> {
    return []
  }

  evaluate(env: Env): Sem.ClsValue {
    return new Sem.ClsNilValue()
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

export class ClsCons extends Cls {
  field_name: string
  local_name: string
  field_t: Core
  rest_t: Cls

  constructor(
    field_name: string,
    local_name: string,
    field_t: Core,
    rest_t: Cls
  ) {
    super()
    this.field_name = field_name
    this.local_name = local_name
    this.field_t = field_t
    this.rest_t = rest_t
  }

  append(cls: Sem.Cls): Sem.Cls {
    return new ClsCons(
      this.field_name,
      this.local_name,
      this.field_t,
      this.rest_t.append(cls)
    )
  }

  get field_names(): Array<string> {
    return [this.field_name, ...this.rest_t.field_names]
  }

  evaluate(env: Env): Sem.ClsValue {
    return new Sem.ClsConsValue(
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
