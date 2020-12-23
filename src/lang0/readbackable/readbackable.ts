import { Exp } from "../exp"

export type Names = Set<string>

export type Readbackable = {
  readbackability: (the: { used: Names }) => Exp
}

export function Readbackable(the: {
  readbackability: (the: { used: Names }) => Exp
}): Readbackable {
  return the
}
