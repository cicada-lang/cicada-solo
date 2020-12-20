import { Exp } from "../exp"
import { Add1, Zero } from "../exps"
import * as ut from "../../ut"

export function nat_to_number(exp: Exp): number | undefined {
  if (exp.kind === "Exp.zero") {
    return 0
  } else if (exp.kind === "Exp.add1") {
    const add1 = exp as Add1
    const almost = nat_to_number(add1.prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
