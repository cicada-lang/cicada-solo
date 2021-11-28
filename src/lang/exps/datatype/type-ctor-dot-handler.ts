import { DotHandler } from "../cls/dot-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"
import { ExpTrace } from "../../errors"

export class TypeCtorDotHandler extends DotHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  get(name: string): Value {
    const ctor = this.target.ctors[name]
    if (ctor === undefined) {
      throw new ExpTrace(
        [
          `I can not find data constructor on type constructor.`,
          `  data constructor name: ${name}`,
          `  type constructor name: ${this.target.name}`,
        ].join("\n")
      )
    }

    return new Exps.DataCtorValue(this.target, name)
  }
}
