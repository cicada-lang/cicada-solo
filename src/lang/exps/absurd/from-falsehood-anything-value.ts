import { evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { GlobalApHandler } from "../global/global-ap-handler"

export class FromFalsehoodAnythingValue extends Exps.GlobalValue {
  name = "from_falsehood_anything"
  arity = 2

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  ap_handler: GlobalApHandler = new GlobalApHandler(this, {
    finial_apply: (arg_value_entries) =>
      // NOTE Be careful about the index.
      from_falsehood_anything(
        arg_value_entries[0].value,
        arg_value_entries[1].value,
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new FromFalsehoodAnythingValue([
      ...this.arg_value_entries,
      arg_value_entry,
    ])
  }

  // NOTE `(target: Absurd, motive: Type) -> motive`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "target",
        new Exps.GlobalCore("Absurd"),
        new Exps.PiCore(
          "motive",
          new Exps.GlobalCore("Type"),
          new Exps.VarCore("motive"),
        ),
      ),
    )
  }
}

function from_falsehood_anything(target: Value, motive: Value): Value {
  if (!(target instanceof Exps.NotYetValue)) {
    throw InternalError.wrong_target(target, {
      expected: [Exps.NotYetValue],
    })
  }

  if (!(target.t instanceof Exps.AbsurdValue)) {
    throw InternalError.wrong_target_t(target.t, {
      expected: [Exps.AbsurdValue],
    })
  }

  return new Exps.NotYetValue(
    motive,
    new Exps.FromFalsehoodAnythingNeutral(
      target.neutral,
      new Normal(new Exps.TypeValue(), motive),
    ),
  )
}
