import { Core } from "../../core"
import * as Cores from "../../cores"

export function nat_from_number(n: number): Core {
  if (n <= 0) {
    return new Cores.Zero()
  } else {
    const almost = nat_from_number(n - 1)
    return new Cores.Add1(almost)
  }
}

export function nat_to_number(exp: Core): number | undefined {
  if (exp instanceof Cores.Zero) {
    return 0
  } else if (exp instanceof Cores.Add1) {
    const almost = nat_to_number((exp as Cores.Add1).prev)
    if (almost !== undefined) {
      return 1 + almost
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
