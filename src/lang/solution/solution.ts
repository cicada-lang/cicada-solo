import { Ctx } from "../ctx"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { expect, readback, Value } from "../value"

export abstract class Solution {
  abstract extend(name: string, value: Value): Solution
  abstract find(name: string): Value | undefined
  abstract names: Array<string>

  static logic_var_p(value: Value): boolean {
    return (
      value instanceof Exps.NotYetValue &&
      value.neutral instanceof Exps.VarNeutral
    )
  }

  static logic_var_name(value: Value): string {
    if (
      value instanceof Exps.NotYetValue &&
      value.neutral instanceof Exps.VarNeutral
    ) {
      return value.neutral.name
    } else {
      throw new Error("Expecting value to be logic variable")
    }
  }

  static get empty(): EmptySolution {
    return new EmptySolution()
  }

  static empty_p(solution: Solution): solution is EmptySolution {
    return solution instanceof EmptySolution
  }

  static get failure(): FailureSolution {
    return new FailureSolution()
  }

  static failure_p(solution: Solution): solution is FailureSolution {
    return solution instanceof FailureSolution
  }

  walk(value: Value): Value {
    while (Solution.logic_var_p(value)) {
      const found = this.find(Solution.logic_var_name(value))
      if (found === undefined) {
        return value
      } else {
        value = found
      }
    }

    return value
  }

  unify_type(ctx: Ctx, x: Value, y: Value): Solution {
    const t = new Exps.TypeValue()
    return this.unify(ctx, t, x, y)
  }

  unify(ctx: Ctx, t: Value, x: Value, y: Value): Solution {
    // {
    //   // DEBUG
    //   if (Solution.logic_var_p(x) && Solution.logic_var_name(x) === "from") {
    //     console.dir(
    //       {
    //         x,
    //         y,
    //         x_walk: this.walk(x),
    //         y_walk: this.walk(y),
    //       },
    //       { depth: 4 }
    //     )
    //   }
    // }

    x = this.walk(x)
    y = this.walk(y)

    if (
      Solution.logic_var_p(x) &&
      Solution.logic_var_p(y) &&
      Solution.logic_var_name(x) === Solution.logic_var_name(y)
    ) {
      return this
    } else if (Solution.logic_var_p(x)) {
      // {
      //   // DEBUG
      //   if (Solution.logic_var_name(x) === "from") {
      //     console.log("We know x === from, showing y:")
      //     console.dir(y)
      //   }
      // }

      // TODO occur check
      return this.extend(Solution.logic_var_name(x), y)
    } else if (Solution.logic_var_p(y)) {
      // {
      //   // DEBUG
      //   if (Solution.logic_var_name(y) === "from") {
      //     console.log("We know y === from, showing x:")
      //     console.dir(x)
      //   }
      // }

      // TODO occur check
      return this.extend(Solution.logic_var_name(y), x)
    } else {
      // NOTE When implementing unify for a `Value` subclass,
      //   the case where the argument is a logic variable is already handled.
      return x.unify(this, ctx, t, y)
    }
  }

  unify_neutral(ctx: Ctx, x: Neutral, y: Neutral): Solution {
    return x.unify_neutral(this, ctx, y)
  }

  unify_normal(ctx: Ctx, x: Normal, y: Normal): Solution {
    return x.unify_normal(this, ctx, y)
  }

  unify_or_fail(ctx: Ctx, t: Value, left: Value, right: Value): Solution {
    const solution = this.unify(ctx, t, left, right)

    if (Solution.failure_p(solution)) {
      const left_format = readback(ctx, new Exps.TypeValue(), left).format()
      const right_format = readback(ctx, new Exps.TypeValue(), right).format()

      throw new ExpTrace(
        [
          `Unification fail`,
          `  left  : ${left_format}`,
          `  right : ${right_format}`,
        ].join("\n")
      )
    }

    return solution
  }

  unify_args(
    ctx: Ctx,
    maybe_pi: Value,
    this_args: Array<Value>,
    that_args: Array<Value>
  ): Solution {
    let solution: Solution = this

    if (this_args.length !== that_args.length) {
      throw new Error(
        [
          `I expect args length to be equal.`,
          `  this_args.length: ${this_args.length}`,
          `  that_args.length: ${that_args.length}`,
        ].join("\n")
      )
    }

    for (const [index, arg] of this_args.entries()) {
      const pi = expect(ctx, maybe_pi, Exps.PiValue)
      maybe_pi = Exps.PiValue.apply(pi, arg)
      solution = solution.unify(ctx, pi.arg_t, arg, that_args[index])
    }

    return solution
  }
}

class ExtendSolution extends Solution {
  // TODO Should `Subst` also contains type of value -- like `Ctx`?
  name: string
  value: Value
  rest: Solution

  constructor(name: string, value: Value, rest: Solution) {
    super()
    this.name = name
    this.value = value
    this.rest = rest
  }

  get names(): Array<string> {
    return [this.name, ...this.rest.names]
  }

  extend(name: string, value: Value): Solution {
    return new ExtendSolution(name, value, this)
  }

  find(name: string): Value | undefined {
    if (name === this.name) {
      return this.value
    } else {
      return this.rest.find(name)
    }
  }
}

class EmptySolution extends Solution {
  names = []

  extend(name: string, value: Value): Solution {
    return new ExtendSolution(name, value, this)
  }

  find(name: string): Value | undefined {
    return undefined
  }
}

class FailureSolution extends Solution {
  names = []

  extend(name: string, value: Value): Solution {
    return this
  }

  find(name: string): Value | undefined {
    return undefined
  }
}
