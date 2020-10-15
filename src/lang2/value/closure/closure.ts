import * as Exp from "../../exp"
import * as Env from "../../env"

export interface Closure {
  env: Env.Env
  name: string
  ret: Exp.Exp
}
