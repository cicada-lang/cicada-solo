import { Core } from "../core"
import { Env } from "../env"
import { Value } from "../value"
import { evaluate } from "../core"

export class RecordClosure {
  env: Env
  ret: Core

  constructor(env: Env, ret: Core) {
    this.env = env
    this.ret = ret
  }

  apply(args: Array<{ name: string; arg: Value }>): Value {
    let env = this.env

    for (const { name, arg } of args) {
      env = env.extend(name, arg)
    }

    return evaluate(env, this.ret)
  }
}
