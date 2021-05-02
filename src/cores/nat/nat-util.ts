import { Core } from "../../core"
import * as Cores from "../../cores"

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
