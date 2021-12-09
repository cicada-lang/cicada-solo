import { Solution } from "../solution"
import { Value } from "../value"

export class ExtendSolution extends Solution {
  // TODO Should `Solution` also contains type of value -- like `Ctx`?
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
