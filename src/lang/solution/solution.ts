import { Ctx } from "../ctx"
import { Value, readback } from "../value"
import { Neutral } from "../neutral"
import { Normal } from "../normal"
import { Core } from "../core"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"

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
    return x.unify(ctx, this, y)
  }

  unify_normal(ctx: Ctx, x: Normal, y: Normal): Solution {
    return x.unify(this, ctx, y)
  }

  unify_or_fail(ctx: Ctx, t: Value, left: Value, right: Value): Solution {
    const solution = this.unify(ctx, t, left, right)

    if (Solution.failure_p(solution)) {
      const left_repr = readback(ctx, new Exps.TypeValue(), left).repr()
      const right_repr = readback(ctx, new Exps.TypeValue(), right).repr()

      throw new ExpTrace(
        [
          `Unification fail`,
          `  left  : ${left_repr}`,
          `  right : ${right_repr}`,
        ].join("\n")
      )
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
