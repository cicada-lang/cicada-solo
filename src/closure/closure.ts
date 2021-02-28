import * as Exp from "../exp"
import * as Env from "../env"

export type Closure = {
  env: Env.Env
  name: string
  ret: Exp.Exp
}
