import { evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { BuiltInApHandler } from "../built-in/built-in-ap-handler"
import { Closure } from "../closure"

export class ReplaceValue extends Exps.BuiltInValue {
  name = "replace"
  arity = 6

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  ap_handler: BuiltInApHandler = new BuiltInApHandler(this, {
    finial_apply: (arg_value_entries) =>
      // NOTE Be careful about the index.
      replace(
        arg_value_entries[3].value,
        arg_value_entries[4].value,
        arg_value_entries[5].value
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new ReplaceValue([...this.arg_value_entries, arg_value_entry])
  }

  // NOTE
  // ```
  // (
  //   implicit T: Type,
  //   implicit from: T,
  //   implicit to: T,
  //   target: Equal(T, from, to),
  //   motive: (T) -> Type,
  //   base: motive(from),
  // ) -> motive(to)
  // ```
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.ImplicitPiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.ImplicitPiCore(
          "from",
          new Exps.VariableCore("T"),
          new Exps.ImplicitPiCore(
            "to",
            new Exps.VariableCore("T"),
            new Exps.PiCore(
              "target",
              new Exps.ApCore(
                new Exps.ApCore(
                  new Exps.ApCore(
                    new Exps.BuiltInCore("Equal"),
                    new Exps.VariableCore("T")
                  ),
                  new Exps.VariableCore("from")
                ),
                new Exps.VariableCore("to")
              ),
              new Exps.PiCore(
                "motive",
                new Exps.PiCore(
                  "_",
                  new Exps.VariableCore("T"),
                  new Exps.BuiltInCore("Type")
                ),
                new Exps.PiCore(
                  "base",
                  new Exps.ApCore(
                    new Exps.VariableCore("motive"),
                    new Exps.VariableCore("from")
                  ),
                  new Exps.ApCore(
                    new Exps.VariableCore("motive"),
                    new Exps.VariableCore("to")
                  )
                )
              )
            )
          )
        )
      )
    )
  }
}

function replace(target: Value, motive: Value, base: Value): Value {
  if (target instanceof Exps.ReflValue) {
    return base
  }

  if (!(target instanceof Exps.NotYetValue)) {
    throw InternalError.wrong_target(target, {
      expected: [Exps.ReflValue],
    })
  }

  if (!(target.t instanceof Exps.EqualValue)) {
    throw InternalError.wrong_target_t(target.t, {
      expected: [Exps.EqualValue],
    })
  }

  const base_t = Exps.ApCore.apply(motive, target.t.from)
  const motive_t = new Exps.PiValue(
    target.t.t,
    new Closure(Env.init(), "x", new Exps.BuiltInCore("Type"))
  )
  return new Exps.NotYetValue(
    Exps.ApCore.apply(motive, target.t.to),
    new Exps.ReplaceNeutral(
      target.neutral,
      new Normal(motive_t, motive),
      new Normal(base_t, base)
    )
  )
}
