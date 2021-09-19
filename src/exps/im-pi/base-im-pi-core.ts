import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from ".."

export class BaseImPiCore extends Core {
  field_name: string
  arg_t: Core
  ret_t: Exps.PiCore

  constructor(field_name: string, arg_t: Core, ret_t: Exps.PiCore) {
    super()
    this.field_name = field_name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value {
    const arg_t = evaluate(env, this.arg_t)
    return new Exps.BaseImPiValue(
      arg_t,
      new Closure(env, this.field_name, this.ret_t)
    )
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const entry = `given ${this.field_name}: ${this.arg_t.repr()}`
    return this.ret_t.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const arg_t_repr = this.arg_t.alpha_repr(ctx)
    const pi_repr = this.ret_t.alpha_repr(ctx.extend(this.field_name))
    return `(given ${arg_t_repr}) -> ${pi_repr}`
  }
}
