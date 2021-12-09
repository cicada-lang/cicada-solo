import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"
import { Closure } from "../closure"

export class ClsClosure extends Closure {
  env: Env
  name: string
  ret_t: Exps.ClsCore

  constructor(env: Env, name: string, ret_t: Exps.ClsCore) {
    super(env, name, ret_t)
    this.env = env
    this.name = name
    this.ret_t = ret_t
  }

  apply(value: Value): Exps.ClsValue {
    return this.ret_t.evaluate(this.env.extend(this.name, value))
  }
}
