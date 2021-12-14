import * as Exps from "../../exps"
import { Value } from "../../value"
import { ApHandler } from "../pi/ap-handler"

export class TodoNoteApHandler extends ApHandler {
  target: Exps.TodoNoteValue

  constructor(target: Exps.TodoNoteValue) {
    super()
    this.target = target
  }

  apply(arg: Value): Value {
    return this.target.curry({ kind: "plain", value: arg })
  }

  vague_apply(arg: Value): Value {
    return this.target.curry({ kind: "vague", value: arg })
  }
}
