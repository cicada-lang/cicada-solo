import { Names } from "../readbackable"
import { Exp } from "../exp"

export type Neutral = {
  kind: string
  readback_neutral: (the: { used: Names }) => Exp
}
