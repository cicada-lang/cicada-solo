import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TodoNoteApHandler extends ApHandler {
  target: Exps.TodoNoteValue

  constructor(target: Exps.TodoNoteValue) {
    super()
    this.target = target
  }

  apply(arg_value_entry: Exps.ArgValueEntry): Value {
    return this.target.curry(arg_value_entry)
  }
}
