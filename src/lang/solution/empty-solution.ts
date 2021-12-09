import { ExtendSolution, Solution } from "../solution"
import { Value } from "../value"

export class EmptySolution extends Solution {
  names = []

  extend(name: string, value: Value): Solution {
    return new ExtendSolution(name, value, this)
  }

  find(name: string): Value | undefined {
    return undefined
  }
}
