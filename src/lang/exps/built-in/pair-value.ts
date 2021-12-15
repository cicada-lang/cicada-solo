import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"
import { PairApHandler } from "./pair-ap-handler"

export class PairValue extends Exps.BuiltInValue {
  arity = 2

  constructor(curried_arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("Pair", curried_arg_value_entries)
  }

  ap_handler = new PairApHandler(this)

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new PairValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE `(A: Type, B: Type) -> Type`
  self_type(): Value {
    const env = Env.init()

    const t = new Exps.PiCore(
      "A",
      new Exps.TypeCore(),
      new Exps.PiCore("B", new Exps.TypeCore(), new Exps.TypeCore())
    )

    return evaluate(env, t)
  }
}
