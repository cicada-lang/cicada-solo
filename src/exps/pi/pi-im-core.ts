import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"

export class PiImCore extends Core {
  name: string
  arg_t: Core
  pi: Exps.PiCore

  constructor(name: string, arg_t: Core, pi: Exps.PiCore) {
    super()
    this.name = name
    this.arg_t = arg_t
    this.pi = pi
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")

    // const arg_t = evaluate(env, this.arg_t)
    // return new Exps.PiImValue(arg_t, new PiImClosure(env, this.name, this.pi))
  }

  multi_pi_repr(entries: Array<string> = new Array()): {
    entries: Array<string>
    ret_t: string
  } {
    const entry = `given ${this.name}: ${this.arg_t.repr()}`
    return this.pi.multi_pi_repr([...entries, entry])
  }

  repr(): string {
    const { entries, ret_t } = this.multi_pi_repr()
    return `(${entries.join(", ")}) -> ${ret_t}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const arg_t_repr = this.arg_t.alpha_repr(ctx)
    const pi_repr = this.pi.alpha_repr(ctx.extend(this.name))
    return `(given ${arg_t_repr}) -> ${pi_repr}`
  }
}
