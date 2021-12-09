import { Solution } from "../solution"
import { Value } from "../value"

export class FailureSolution extends Solution {
  message: string
  names = []

  constructor(message: string) {
    super()
    this.message = message
  }

  extend(name: string, value: Value): Solution {
    return this
  }

  find(name: string): Value | undefined {
    return undefined
  }
}
