import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"

export class TodoValue extends Exps.GlobalValue {
  name = "TODO"
  arity = 1

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super(arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.GlobalValue {
    return new TodoValue([...this.arg_value_entries, arg_value_entry])
  }

  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    const t_core = readback(ctx, new Exps.TypeValue(), t)

    ctx.broadcast({
      tag: "todo",
      msg: [
        `${ctx.highlight("warn", "TODO")}`,
        `  ${ctx.highlight("code", t_core.format())}`,
      ].join("\n"),
    })
  }

  // NOTE `(vague T: Type) -> T`
  self_type(): Value {
    return evaluate(
      Env.init(),
      new Exps.VaguePiCore(
        "T",
        new Exps.GlobalCore("Type"),
        new Exps.VarCore("T")
      )
    )
  }
}
