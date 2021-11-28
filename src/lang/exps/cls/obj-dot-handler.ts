import { DotHandler } from "../cls/dot-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

export class ObjDotHandler extends DotHandler {
  target: Exps.ObjValue

  constructor(target: Exps.ObjValue) {
    super()
    this.target = target
  }

  get(name: string): Value {
    const value = this.target.properties.get(name)
    if (value === undefined) {
      throw new ExpTrace(`The property name: ${name} of object is undefined.`)
    }

    return value
  }
}
