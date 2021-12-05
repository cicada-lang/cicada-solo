import { Core, evaluate } from "../core"
import { Env } from "../env"
import { Value } from "../value"

export class Closure {
  env: Env
  name: string
  ret: Core

  constructor(env: Env, name: string, ret: Core) {
    this.env = env
    this.name = name
    this.ret = ret
  }

  apply(arg: Value): Value {
    return evaluate(this.env.extend(this.name, arg), this.ret)
  }
}
