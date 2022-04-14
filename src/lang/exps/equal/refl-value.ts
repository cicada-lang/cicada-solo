import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { check_conversion, expect, Value } from "../../value"

export class ReflValue extends Exps.BuiltInValue {
  name = "refl"
  arity = 2

  constructor(...arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new ReflValue(...[...this.arg_value_entries, arg_value_entry])
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

  // NOTE `(vague T: Type, vague x: T) -> Equal(T, x, x)`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.VaguePiCore(
        "T",
        new Exps.BuiltInCore("Type"),
        new Exps.VaguePiCore(
          "x",
          new Exps.VarCore("T"),
          new Exps.ApCore(
            new Exps.ApCore(
              new Exps.ApCore(
                new Exps.BuiltInCore("Equal"),
                new Exps.VarCore("T")
              ),
              new Exps.VarCore("x")
            ),
            new Exps.VarCore("x")
          )
        )
      )
    )
  }
}
