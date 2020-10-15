import * as Closure from "../closure"
import * as Value from "../../value"
import * as Exp from "../../exp"
import * as Env from "../../env"

export function create(
  env: Env.Env,
  name: string,
  ret: Exp.Exp
): Closure.Closure {
  return {
    env,
    name,
    ret,
  }
}
