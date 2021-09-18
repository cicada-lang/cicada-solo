import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Subst } from "../../solution"
import { RecordClosure } from "../record-closure"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class ImPiCore extends Core {
  implicit: Array<{ name: string; arg_t: Core }>
  ret_t: Exps.PiCore

  constructor(
    implicit: Array<{ name: string; arg_t: Core }>,
    ret_t: Exps.PiCore
  ) {
    super()
    this.implicit = implicit
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value {
    const implicit = this.implicit.map(({ name, arg_t }) => ({
      name,
      arg_t: evaluate(env, arg_t),
    }))
    return new Exps.ImPiValue(implicit, new RecordClosure(env, this.ret_t))
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const implicit = this.implicit
      .map(({ name, arg_t }) => `${name}: ${arg_t.repr()}`)
      .join(", ")
    const entry = `implicit { ${implicit} }`
    return this.ret_t.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const implicit = this.implicit
      .map(({ name, arg_t }) => {
        const result = `${name}: ${arg_t.alpha_repr(ctx)}`
        ctx = ctx.extend(name)
        return result
      })
      .join(", ")
    const entry = `implicit { ${implicit} }`
    const ret_t_repr = this.ret_t.alpha_repr(ctx)
    return `(${entry}) -> ${ret_t_repr}`
  }
}
