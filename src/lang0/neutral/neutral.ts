import { Exp } from "../exp"
import { Names } from "../readbackable"

export type Neutral = {
  kind: string
  readback_neutral: (the: { used: Names }) => Exp
}
