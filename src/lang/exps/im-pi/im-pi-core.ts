import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { evaluate } from "../../core"
import * as Exps from "../../exps"
import { PiFormater } from "../pi/pi-formater"
import { ImInserter } from "./im-inserter"
import { LastImInserter } from "./last-im-inserter"
import { MoreImInserter } from "./more-im-inserter"

export class ImPiCore extends Core {
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
    const ret_t_cl = new Closure(env, this.name, this.ret_t)

    const im_inserter =
      this.ret_t instanceof Exps.ImPiCore
        ? new MoreImInserter(arg_t, ret_t_cl)
        : new LastImInserter(arg_t, ret_t_cl)

    return new Exps.ImPiValue(arg_t, ret_t_cl, { im_inserter })
  }

  pi_formater: PiFormater = new PiFormater(this, {
    decorate_binding: (binding) => `implicit ${binding}`,
  })

  format(): string {
    return this.pi_formater.format()
  }

  alpha_format(ctx: AlphaCtx): string {
    const arg_t_format = this.arg_t.alpha_format(ctx)
    const pi_format = this.ret_t.alpha_format(ctx.extend(this.name))
    return `(implicit ${arg_t_format}) -> ${pi_format}`
  }
}
