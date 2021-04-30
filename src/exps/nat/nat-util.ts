import { Exp } from "../../exp"
import { Zero, Add1 } from "../../exps"

export function nat_from_number(n: number): Exp {
  if (n <= 0) {
    return new Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Add1(almost)
  }
}

export function nat_to_number(exp: Exp): number | undefined {
  if (exp instanceof Zero) {
    return 0
  } else if (exp instanceof Add1) {
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
