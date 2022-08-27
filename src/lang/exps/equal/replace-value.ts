import { evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { Closure } from "../closure"
import { GlobalApHandler } from "../global/global-ap-handler"

export class ReplaceValue extends Exps.GlobalValue {
  name = "replace"
  arity = 6

  constructor(arg_value_entries: Array<Exps.ArgValueEntry> = []) {
    super(arg_value_entries)
  }

  ap_handler: GlobalApHandler = new GlobalApHandler(this, {
    finial_apply: (arg_value_entries) =>
      // NOTE Be careful about the index.
      replace(
        arg_value_entries[3].value,
        arg_value_entries[4].value,
        arg_value_entries[5].value
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
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
        new Exps.GlobalCore("Type"),
        new Exps.ImplicitPiCore(
          "from",
          new Exps.VarCore("T"),
          new Exps.ImplicitPiCore(
            "to",
            new Exps.VarCore("T"),
            new Exps.PiCore(
              "target",
              new Exps.ApCore(
                new Exps.ApCore(
                  new Exps.ApCore(
                    new Exps.GlobalCore("Equal"),
                    new Exps.VarCore("T")
                  ),
                  new Exps.VarCore("from")
                ),
                new Exps.VarCore("to")
              ),
              new Exps.PiCore(
                "motive",
                new Exps.PiCore(
                  "_",
                  new Exps.VarCore("T"),
                  new Exps.GlobalCore("Type")
                ),
                new Exps.PiCore(
                  "base",
                  new Exps.ApCore(
                    new Exps.VarCore("motive"),
                    new Exps.VarCore("from")
                  ),
                  new Exps.ApCore(
                    new Exps.VarCore("motive"),
                    new Exps.VarCore("to")
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
    new Closure(Env.init(), "x", new Exps.GlobalCore("Type"))
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
