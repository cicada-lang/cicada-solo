import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Core } from "../../core"
import { readback } from "../../value"
import { Value } from "../../value"
import { expect } from "../../value"
import { evaluate } from "../../core"
import { Solution } from "../../solution"
import { Closure } from "../closure"
import { conversion } from "../../value"
import * as ut from "../../../ut"
import * as Exps from ".."

export class DatatypeValue extends Value {
  type_ctor: Exps.TypeCtorValue
  args: Array<Value>

  constructor(type_ctor: Exps.TypeCtorValue, args: Array<Value>) {
    super()
    this.type_ctor = type_ctor
    this.args = args
  }

  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof Exps.TypeValue) {
      let result: Core = new Exps.VarCore(this.type_ctor.name)
      let self_type = this.type_ctor.self_type()
      for (const [index, arg] of this.args.entries()) {
        const pi = expect(ctx, self_type, Exps.PiValue)
        self_type = Exps.PiValue.apply(pi, arg)
        const arg_t = readback(ctx, pi.arg_t, arg)
        result = new Exps.ApCore(result, arg_t)
      }

      return result
    }
  }

  unify(solution: Solution, ctx: Ctx, t: Value, that: Value): Solution {
    if (that instanceof Exps.DatatypeValue) {
      // TODO `t` in the arguments is not used here.
      solution = solution.unify(
        ctx,
        this.type_ctor.self_type(),
        this.type_ctor,
        that.type_ctor
      )

      if (this.args.length !== that.args.length) {
        throw new Error(
          [
            `I expect args length to be equal.`,
            `  this.args.length: ${this.args.length}`,
            `  that.args.length: ${that.args.length}`,
          ].join("\n")
        )
      }

      let self_type = this.type_ctor.self_type()
      for (const [index, arg] of this.args.entries()) {
        const pi = expect(ctx, self_type, Exps.PiValue)
        self_type = Exps.PiValue.apply(pi, arg)
        solution = solution.unify(ctx, pi.arg_t, arg, that.args[index])
      }

      return solution
    } else {
      return Solution.failure
    }
  }
}
