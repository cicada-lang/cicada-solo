import { ApHandler } from "../pi/ap-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"

export abstract class ClsApHandler extends ApHandler {
  abstract apply(arg: Value): Exps.ClsValue
}
