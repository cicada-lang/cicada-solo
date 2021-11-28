import { DotHandler } from "../cls/dot-handler"
import { Value } from "../../value"
import * as Exps from "../../exps"
import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { evaluate } from "../../core"
import { ExpTrace } from "../../errors"

export class TypeCtorDotHandler extends DotHandler {
  target: Exps.TypeCtorValue

  constructor(target: Exps.TypeCtorValue) {
    super()
    this.target = target
  }

  get(name: string): Value {
    const data_ctor = this.target.data_ctors[name]
    if (data_ctor === undefined) {
      throw new ExpTrace(
        [
          `I can not find data constructor on type constructor.`,
          `  data constructor name: ${name}`,
          `  type constructor name: ${this.target.name}`,
        ].join("\n")
      )
    }

    return new Exps.DataCtorValue(this.target, name, data_ctor.ret_t)
  }

  infer_by_target(
    ctx: Ctx,
    core: Core,
    name: string
  ): { t: Value; core: Core } {
    const data_ctor = this.target.data_ctors[name]
    if (data_ctor === undefined) {
      throw new ExpTrace(
        [
          `I can not find data constructor on type constructor.`,
          `  data constructor name: ${name}`,
          `  type constructor name: ${this.target.name}`,
        ].join("\n")
      )
    }

    let t_core = data_ctor.ret_t
    for (const [name, arg_t] of Object.entries(this.target.fixed)) {
      t_core = new Exps.ReturnedPiCore(name, arg_t, t_core)
    }

    return {
      t: evaluate(this.target.env, t_core),
      core: new Exps.DotCore(new Exps.VarCore(this.target.name), name),
    }
  }
}
