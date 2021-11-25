import { ImplicitInserter, ImplicitApEntry } from "./implicit-inserter"
import { Ctx } from "../../ctx"
import { Exp } from "../../exp"
import { Core } from "../../core"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { Value } from "../../value"
import { expect } from "../../value"
import { Closure } from "../closure"
import { ExpTrace } from "../../errors"
import * as Exps from ".."

export class MoreImplicitInserter extends ImplicitInserter {
  arg_t: Value
  ret_t_cl: Closure

  constructor(arg_t: Value, ret_t_cl: Closure) {
    super(arg_t, ret_t_cl)
    this.arg_t = arg_t
    this.ret_t_cl = ret_t_cl
  }

  solve_implicit_ap(ctx: Ctx, inferred_arg_t: Value): Solution {
    const ret_t = expect(
      ctx,
      this.next_ret_t(ctx, inferred_arg_t),
      Exps.ImplicitPiValue
    )

    return ret_t.implicit_inserter.solve_implicit_ap(ctx, inferred_arg_t)
  }
}
