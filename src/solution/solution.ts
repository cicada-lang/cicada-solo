import { Value } from "../value"
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

  unify(x: Value, y: Value): Solution {
    x = this.walk(x)
    y = this.walk(y)

    if (Solution.logic_var_p(x) && Solution.logic_var_p(y)) {
      if (Solution.logic_var_name(x) === Solution.logic_var_name(x)) {
        return this
      } else {
        return Solution.failure
      }
    } else if (Solution.logic_var_p(x)) {
      // TODO occur check
      return this.extend(Solution.logic_var_name(x), y)
    } else if (Solution.logic_var_p(y)) {
      // TODO occur check
      return this.extend(Solution.logic_var_name(y), x)
    } else {
      // NOTE When implementing unify for a `Value` subclass,
      //   the case where the argument is a logic variable is already handled.
      return x.unify(this, y)
    }
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
    throw new Error(`Can not find name: ${name}, from a FailureSubst.`)
  }
}
