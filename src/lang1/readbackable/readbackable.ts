import { Ty } from "../ty"
import { Exp } from "../exp"

export type Names = Set<string>

export type Readbackable = {
  readbackability: (t: Ty, the: { used: Names }) => Exp
}

export function Readbackable(the: {
  readbackability: (t: Ty, the: { used: Names }) => Exp
}): Readbackable {
  return the
}
