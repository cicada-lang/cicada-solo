import { evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { readback, Value } from "../../value"
import { TodoNoteApHandler } from "./todo-note-ap-handler"

export class TodoNoteValue extends Exps.BuiltInValue {
  arity = 2

  constructor(curried_arg_value_entries: Array<Exps.ArgValueEntry>) {
    super("TODO_NOTE", curried_arg_value_entries)
  }

  ap_handler = new TodoNoteApHandler(this)

  before_check(ctx: Ctx, arg_entries: Array<Exps.ArgEntry>, t: Value): void {
    // TODO
    // const t_core = readback(ctx, new Exps.TypeValue(), t)
    // const t_format = ctx.highlight("code", t_core.format())
    // const head = ctx.highlight("warn", "TODO")
    // ctx.broadcast({
    //   tag: "todo",
    //   msg: `${head}\n  ${t_format}`,
    // })
  }

  curry(arg_value_entry: Exps.ArgValueEntry): Exps.BuiltInValue {
    return new TodoNoteValue([
      ...this.curried_arg_value_entries,
      arg_value_entry,
    ])
  }

  // NOTE `(vague T: Type, note: String) -> T`
  self_type(): Value {
    const env = Env.init()

    const t = new Exps.VaguePiCore(
      "T",
      new Exps.TypeCore(),
      new Exps.PiCore("note", new Exps.StrCore(), new Exps.VariableCore("T"))
    )

    return evaluate(env, t)
  }
}
