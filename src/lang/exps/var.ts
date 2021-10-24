import { Exp, ExpMeta, ElaborationOptions, subst } from "../exp"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Value } from "../value"
import { readback } from "../value"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"

export class Var extends Exp {
  meta?: ExpMeta
  name: string

  constructor(name: string, meta?: ExpMeta) {
    super()
    this.meta = meta
    this.name = name
  }

  free_names(bound_names: Set<string>): Set<string> {
    if (bound_names.has(this.name)) {
      return new Set()
    } else {
      return new Set([this.name])
    }
  }

  subst(name: string, exp: Exp): Exp {
    if (name === this.name) {
      // TODO How to handle `span` when doing a `subst`
      return exp
    } else {
      return this
    }
  }

  infer(ctx: Ctx, opts: ElaborationOptions): { t: Value; core: Core } {
    const t = ctx.find_type(this.name)
    if (t === undefined) {
      throw new ExpTrace(
        `Fail to infer the type of a variable.\n` +
          `The name ${this.name} is undefined.`
      )
    }

    const core = new Exps.VarCore(this.name)

    if (opts?.narrate_elaboration_p) {
      const name = ctx.highlight("code", this.name)
      const t_core = readback(ctx, new Exps.TypeValue(), t)
      const t_repr = ctx.highlight("code", t_core.repr())
      const core_repr = ctx.highlight("code", core.repr())
      ctx.narration([
        `Given the variable ${name},`,
        `I look up the context to find its type.`,
        `The lookup succeeds with type ${t_repr},`,
        `thus I infer its type to be ${t_repr},`,
        `and elaborate the variable to ${core_repr}.`,
      ])
    }

    return { t, core }
  }

  repr(): string {
    return this.name
  }
}
