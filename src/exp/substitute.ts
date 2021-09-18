import { Exp } from "../exp"
import * as Exps from "../exps"

export function substitute(target: Exp, name: string, exp: Exp): Exp {
  if (exp instanceof Exps.Var && exp.name === name) {
    return target
  } else {
    return target.substitute(name, exp)
  }
}
