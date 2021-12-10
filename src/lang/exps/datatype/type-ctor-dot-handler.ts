import { Core, evaluate } from "../../core"
import { Ctx } from "../../ctx"
import { ExpTrace } from "../../errors"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { DotHandler } from "../cls/dot-handler"

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

    return new Exps.DataCtorValue(
      this.target,
      name,
      data_ctor.t,
      data_ctor.original_bindings
    )
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

    let t_core = data_ctor.t
    for (const [name, arg_t] of Object.entries(this.target.fixed).reverse()) {
      t_core = new Exps.VaguePiCore(name, arg_t, t_core)
    }

    return {
      t: evaluate(this.target.env, t_core),
      core: new Exps.DotCore(new Exps.VariableCore(this.target.name), name),
    }
  }
}
