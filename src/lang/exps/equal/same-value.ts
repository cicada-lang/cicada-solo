import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { check_conversion, expect, Value } from "../../value"
import { GlobalApHandler } from "../global/global-ap-handler"

export class SameValue extends Exps.GlobalValue {
  name = "same"
  arity = 2

  constructor(...arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  ap_handler: GlobalApHandler = new GlobalApHandler(this, {
    finial_apply: (arg_value_entries) =>
      new Exps.ReflValue(
        ...([
          { kind: "vague", value: arg_value_entries[0].value },
          { kind: "vague", value: arg_value_entries[1].value },
        ] as const),
      ),
  })

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new SameValue(...[...this.arg_value_entries, arg_value_entry])
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

  // NOTE `(implicit T: Type, x: T) -> Equal(T, x, x)`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.ImplicitPiCore(
        "T",
        new Exps.GlobalCore("Type"),
        new Exps.PiCore(
          "x",
          new Exps.VarCore("T"),
          new Exps.ApCore(
            new Exps.ApCore(
              new Exps.ApCore(
                new Exps.GlobalCore("Equal"),
                new Exps.VarCore("T"),
              ),
              new Exps.VarCore("x"),
            ),
            new Exps.VarCore("x"),
          ),
        ),
      ),
    )
  }
}
