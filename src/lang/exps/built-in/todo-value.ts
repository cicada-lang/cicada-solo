import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"
import { TodoApHandler } from "./todo-ap-handler"

export class TodoValue extends Exps.BuiltInValue {
  arity = 1

  constructor(curried_arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("TODO", curried_arg_value_entries)
  }

  ap_handler = new TodoApHandler(this)

  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    const t_core = readback(ctx, new Exps.TypeValue(), t)
    const t_format = ctx.highlight("code", t_core.format())
    const head = ctx.highlight("warn", "TODO")
    ctx.todo(`${head}\n  ${t_format}`)
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TodoValue([...this.curried_arg_value_entries, arg_value_entry])
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
