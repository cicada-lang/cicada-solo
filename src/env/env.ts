import { Value } from "../value"

export abstract class Env {
  abstract find_value(name: string): undefined | Value

  static init(): EmptyEnv {
    return new EmptyEnv()
  }

  extend(name: string, value: Value): Env {
    return new ExtendEnv(name, value, this)
  }
}

class ExtendEnv extends Env {
  name: string
  value: Value
  rest: Env

  constructor(name: string, value: Value, rest: Env) {
    super()
    this.name = name
    this.value = value
    this.rest = rest
  }

  find_value(name: string): undefined | Value {
    if (name === this.name) {
      return this.value
    } else {
      return this.rest.find_value(name)
    }
  }
}

class EmptyEnv extends Env {
  find_value(name: string): undefined | Value {
    return undefined
  }
}
