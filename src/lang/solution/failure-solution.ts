import { Solution } from "../solution"
import { Value } from "../value"

export class FailureSolution extends Solution {
  names = []

  extend(name: string, value: Value): Solution {
    return this
  }

  find(name: string): Value | undefined {
    return undefined
  }
}
