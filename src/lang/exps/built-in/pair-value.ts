import { evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { BuiltInApHandler } from "./built-in-ap-handler"

export class PairValue extends Exps.BuiltInValue {
  arity = 2

  constructor(curried_arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("Pair", curried_arg_value_entries)
  }

  ap_handler: BuiltInApHandler = new BuiltInApHandler(this, {
    finial_apply: (arg_value_entries) => {
      const env = Env.init()
        .extend("A", arg_value_entries[0].value)
        .extend("B", arg_value_entries[1].value)

      const t = new Exps.SigmaCore(
        "_",
        new Exps.VariableCore("A"),
        new Exps.VariableCore("B")
      )

      return evaluate(env, t)
    },
  })

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
