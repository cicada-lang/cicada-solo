import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

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
