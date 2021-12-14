import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TodoApHandler extends ApHandler {
  target: Exps.TodoValue

  constructor(target: Exps.TodoValue) {
    super()
    this.target = target
  }

  vague_apply(arg: Value): Value {
    return this.target.curry({ kind: "vague", value: arg })
  }
}
