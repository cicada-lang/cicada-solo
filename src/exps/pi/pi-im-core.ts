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
    // return new Exps.PiValue(arg_t, new Closure(env, this.name, this.ret_t))
  }

  private multi_pi(
    entries: Array<{ name: string; arg_t: Core }> = new Array()
  ): {
    entries: Array<{ name: string; arg_t: Core }>
    ret_t: Core
  } {
    throw new Error("TODO")

    // const entry = { name: this.name, arg_t: this.arg_t }

    // if (this.ret_t instanceof PiCore) {
    //   return this.ret_t.multi_pi([...entries, entry])
    // } else {
    //   return {
    //     entries: [...entries, entry],
    //     ret_t: this.ret_t,
    //   }
    // }
  }

  repr(): string {
    throw new Error("TODO")

    // const { entries, ret_t } = this.multi_pi()
    // const entries_repr = entries
    //   .map(({ name, arg_t }) => `${name}: ${arg_t.repr()}`)
    //   .join(", ")
    // return `(${entries_repr}) -> ${ret_t.repr()}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")

    // const arg_t_repr = this.arg_t.alpha_repr(ctx)
    // const ret_t_repr = this.ret_t.alpha_repr(ctx.extend(this.name))
    // return `(${arg_t_repr}) -> ${ret_t_repr}`
  }
}
