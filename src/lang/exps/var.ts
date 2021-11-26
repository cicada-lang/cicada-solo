import { Exp, ExpMeta, ElaborationOptions, subst } from "../exp"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { infer } from "../exp"
import { check } from "../exp"
import { check_by_infer } from "../exp"
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

  check(ctx: Ctx, t: Value): Core {
    const found_t = ctx.find_type(this.name)

    if (found_t instanceof Exps.ReturnedPiValue) {
      return found_t.returned_inserter.insert_returned_ap(
        ctx,
        new Exps.VarCore(this.name),
        [],
        t
      )
    }

    return check_by_infer(ctx, this, t)
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
      const t_format = ctx.highlight("code", t_core.format())
      const core_format = ctx.highlight("code", core.format())
      ctx.narration([
        `Given the variable ${name},`,
        `I look up the context to find its type.`,
        `The lookup succeeds with type ${t_format},`,
        `thus I infer its type to be this type,`,
        `and elaborate the variable to ${core_format}.`,
      ])
    }

    return { t, core }
  }

  format(): string {
    return this.name
  }
}
