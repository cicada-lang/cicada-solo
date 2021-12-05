import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ClsClosure {
  env: Env
  local_name: string
  rest_t: Exps.ClsCore

  constructor(env: Env, local_name: string, rest_t: Exps.ClsCore) {
    this.env = env
    this.local_name = local_name
    this.rest_t = rest_t
  }

  apply(value: Value): Exps.ClsValue {
    return this.rest_t.evaluate(this.env.extend(this.local_name, value))
  }
}
