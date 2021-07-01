import { Core } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import * as Sem from "../../sem"

export class ClsClosure {
  env: Env
  local_name: string
  rest_t: Sem.Cls

  constructor(env: Env, local_name: string, rest_t: Sem.Cls) {
    this.env = env
    this.local_name = local_name
    this.rest_t = rest_t
  }

  apply(value: Value): Sem.ClsValue {
    return this.rest_t.evaluate(this.env.extend(this.local_name, value))
  }
}
