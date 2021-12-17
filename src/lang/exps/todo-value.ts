import { evaluate } from "../core"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Exps from "../exps"
import { readback, Value } from "../value"

export class TodoValue extends Exps.BuiltInValue {
  arity = 1

  constructor(arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("TODO", arg_value_entries)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
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
    const env = Env.init()

    const t = new Exps.VaguePiCore(
      "T",
      new Exps.TypeCore(),
      new Exps.VariableCore("T")
    )

    return evaluate(env, t)
  }
}
