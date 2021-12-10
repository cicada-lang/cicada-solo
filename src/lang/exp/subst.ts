import { Exp } from "../exp"
import * as Exps from "../exps"

export function subst(target: Exp, name: string, exp: Exp): Exp {
  if (exp instanceof Exps.Variable && exp.name === name) {
    return target
  } else {
    return target.subst(name, exp)
  }
}
