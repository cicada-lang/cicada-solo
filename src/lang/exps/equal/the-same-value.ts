import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { check_conversion, expect, Value } from "../../value"
import { BuiltInApHandler } from "../built-in/built-in-ap-handler"

export class TheSameValue extends Exps.BuiltInValue {
  arity = 2

  constructor(...arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("the_same", arg_value_entries)
  }

  ap_handler: BuiltInApHandler = new BuiltInApHandler(this, {
    finial_apply: (arg_value_entries) =>
      new Exps.ReflValue(
        ...([
          { kind: "vague", value: arg_value_entries[0].value },
          { kind: "vague", value: arg_value_entries[1].value },
        ] as const)
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TheSameValue(...[...this.arg_value_entries, arg_value_entry])
  }

  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    const equal = expect(ctx, t, Exps.EqualValue)

    check_conversion(ctx, equal.t, equal.from, equal.to, {
      description: {
        from: "left hand side (from) of Equal",
        to: "right hand side (to) of Equal",
      },
    })
  }

  // NOTE `(T: Type, x: T) -> Equal(T, x, x)`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.PiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.PiCore(
          "x",
          new Exps.VariableCore("T"),
          new Exps.ApCore(
            new Exps.ApCore(
              new Exps.ApCore(
                new Exps.BuiltInCore("Equal"),
                new Exps.VariableCore("T")
              ),
              new Exps.VariableCore("x")
            ),
            new Exps.VariableCore("x")
          )
        )
      )
    )
  }
}
