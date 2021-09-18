import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Trace, InternalError } from "../../errors"
import * as ut from "../../ut"
import * as Exps from "../../exps"

export class ImAp extends Exp {
  target: Exp
  arg: Exp

  constructor(target: Exp, arg: Exp) {
    super()
    this.target = target
    this.arg = arg
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.target.free_names(bound_names),
      ...this.arg.free_names(bound_names),
    ])
  }

  substitute(name: string, exp: Exp): ImAp {
    return new ImAp(
      this.target.substitute(name, exp),
      this.arg.substitute(name, exp)
    )
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    if (inferred_target.t instanceof Exps.ImPiValue) {
      const im_pi = inferred_target.t
      const arg_core = check(ctx, this.arg, im_pi.arg_t)
      const arg_value = evaluate(ctx.to_env(), arg_core)

      return {
        t: im_pi.ret_t_cl.apply(arg_value),
        core: new Exps.ImApCore(inferred_target.core, arg_core),
      }
    }

    throw new Trace(`I am expecting value of type: ImPiValue`)
  }

  multi_ap_repr(args: Array<string> = new Array()): {
    target: string
    args: Array<string>
  } {
    const arg = `given ${this.arg.repr()}`

    if (this.target instanceof Exps.Ap || this.target instanceof Exps.ImAp) {
      return this.target.multi_ap_repr([arg, ...args])
    } else {
      return {
        target: this.target.repr(),
        args: [arg, ...args],
      }
    }
  }

  repr(): string {
    const { target, args } = this.multi_ap_repr()
    return `${target}(${args.join(", ")})`
  }
}
