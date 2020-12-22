import * as Exp from "../exp"
import { Add1 } from "../exps/add1"

export function nat_to_number(exp: Exp.Exp): number | undefined {
  if (exp.kind === "Exp.zero") {
    return 0
  } else if (exp.kind === "Exp.add1") {
    const almost = nat_to_number((exp as Add1).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
