import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../evaluate"
import { Closure } from "../../closure"
import { Value } from "../../value"
import { Env } from "../../env"
import * as Cores from "../../cores"
import * as ut from "../../ut"

export abstract class Cls2 extends Core {
  instanceofCoresCls2 = true
}

export class ClsNil extends Cls2 {
  evaluate(env: Env): Value {
    return new Cores.ClsNilValue()
  }

  repr(): string {
    return `class {}`
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

  evaluate(env: Env): Value {
    return new Cores.ClsConsValue(
      this.field_name,
      evaluate(env, this.field_t),
      new Closure(env, this.local_name, this.rest_t)
    )
  }

  repr(): string {
    throw new Error()
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error()
  }
}
