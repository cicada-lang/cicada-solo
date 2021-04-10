import { Exp } from "../exp"
import { Env } from "../env"
import { Value } from "../value"
import { evaluate } from "../evaluate"

export class Closure {
  env: Env
  name: string
  ret: Exp

  constructor(env: Env, name: string, ret: Exp) {
    this.env = env
    this.name = name
    this.ret = ret
  }

  apply(value: Value): Value {
    return evaluate(this.env.extend(this.name, value), this.ret)
  }
}
