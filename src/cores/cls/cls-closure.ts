import { Core } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class ClsClosure {
  env: Env
  local_name: string
  rest_t: Cores.Cls

  constructor(env: Env, local_name: string, rest_t: Cores.Cls) {
    this.env = env
    this.local_name = local_name
    this.rest_t = rest_t
  }

  apply(value: Value): Cores.ClsValue {
    return this.rest_t.evaluate(this.env.extend(this.local_name, value))
  }
}
