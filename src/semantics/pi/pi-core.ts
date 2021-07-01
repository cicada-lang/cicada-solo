import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { evaluate } from "../../core"
import * as Sem from "../../sem"

export class Pi extends Core {
  name: string
  arg_t: Core
  ret_t: Core

  constructor(name: string, arg_t: Core, ret_t: Core) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.ret_t = ret_t
  }

  evaluate(env: Env): Value {
    const arg_t = evaluate(env, this.arg_t)
    return new Sem.PiValue(arg_t, new Closure(env, this.name, this.ret_t))
  }

  private multi_pi(
    entries: Array<{ name: string; arg_t: Core }> = new Array()
  ): {
    entries: Array<{ name: string; arg_t: Core }>
    ret_t: Core
  } {
    const entry = { name: this.name, arg_t: this.arg_t }

    if (this.ret_t instanceof Pi) {
      return this.ret_t.multi_pi([...entries, entry])
    } else {
      return {
        entries: [...entries, entry],
        ret_t: this.ret_t,
      }
    }
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi()
    const entries_repr = entries
      .map(({ name, arg_t }) => `${name}: ${arg_t.repr()}`)
      .join(", ")
    return `(${entries_repr}) -> ${ret_t.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const arg_t_repr = this.arg_t.alpha_repr(ctx)
    const ret_t_repr = this.ret_t.alpha_repr(ctx.extend(this.name))
    return `(${arg_t_repr}) -> ${ret_t_repr}`
  }
}
