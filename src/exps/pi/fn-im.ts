import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value, Subst } from "../../value"
import { check } from "../../exp"
import { expect } from "../../value"
import { Trace } from "../../errors"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class FnIm extends Exp {
  name: string
  fn: Exps.Fn

  constructor(name: string, fn: Exps.Fn) {
    super()
    this.name = name
    this.fn = fn
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([
      ...this.fn.free_names(new Set([...bound_names, this.name])),
    ])
  }

  subst(name: string, exp: Exp): FnIm {
    if (name === this.name) {
      return this
    } else {
      const free_names = exp.free_names(new Set())
      const fresh_name = ut.freshen_name(free_names, this.name)
      const fn = this.fn.subst(this.name, new Exps.Var(fresh_name))
      return new FnIm(fresh_name, fn.subst(name, exp))
    }
  }

  check(ctx: Ctx, t: Value): Core {
    const fresh_name = ut.freshen_name(new Set(ctx.names), this.name)
    const pi_im = expect(ctx, t, Exps.PiImValue)
    const arg = new Exps.NotYetValue(
      pi_im.arg_t,
      new Exps.VarNeutral(fresh_name)
    )
    const pi = pi_im.pi_cl.apply(arg)
    const fn = this.fn.subst(this.name, new Exps.Var(fresh_name))
    const fn_core = check(ctx.extend(fresh_name, pi_im.arg_t), fn, pi)

    if (!(fn_core instanceof Exps.FnCore)) {
      throw new Trace(
        [
          `I expect fn_core to be Exps.FnCore`,
          `but the constructor name I meet is: ${fn_core.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.FnImCore(fresh_name, fn_core)
  }

  multi_fn_repr(names: Array<string> = new Array()): {
    names: Array<string>
    ret: string
  } {
    const name = `given ${this.name}`
    return this.fn.multi_fn_repr([...names, name])
  }

  repr(): string {
    const { names, ret } = this.multi_fn_repr()
    return `(${names.join(", ")}) { ${ret} }`
  }
}
