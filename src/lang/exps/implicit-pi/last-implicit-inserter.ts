import { ImplicitInserter, ImplicitApEntry } from "./implicit-inserter"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { readback } from "../../value"
import { evaluate } from "../../core"
import { infer } from "../../exp"
import { check } from "../../exp"
import { Value } from "../../value"
import { expect } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from ".."

export class LastImplicitInserter extends ImplicitInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super(arg_t, ret_t_cl)
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  solve_implicit_ap(ctx: Ctx, inferred_arg_t: Value): Solution {
    const ret_t = this.next_ret_t(ctx, inferred_arg_t)

    const solution = Solution.empty.unify_or_fail(
      ctx,
      new Exps.TypeValue(),
      ret_t.arg_t,
      inferred_arg_t
    )

    return solution
  }

  collect_implicit_ap_entries(
    ctx: Ctx,
    inferred_arg_t: Value,
    entries: Array<ImplicitApEntry>
  ): { entries: Array<ImplicitApEntry>; ret_t_cl: Closure } {
    const entry = this.implicit_ap_entry(ctx, inferred_arg_t)

    const pi = expect(
      ctx,
      this.ret_t_cl.apply(entry.implicit_arg),
      Exps.PiValue
    )

    return {
      entries: [...entries, entry],
      ret_t_cl: pi.ret_t_cl,
    }
  }
}
