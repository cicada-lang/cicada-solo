import { Core } from "../../core"
import { Zero, Add1 } from "../../cores"

export function nat_from_number(n: number): Core {
  if (n <= 0) {
    return new Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Add1(almost)
  }
}

export function nat_to_number(exp: Core): number | undefined {
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
