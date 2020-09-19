import * as Env from "../env"
import * as Exp from "../exp"

export interface Closure {
  name: string
  exp: Exp.Exp
  env: Env.Env
}
