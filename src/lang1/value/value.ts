import { Readbackable } from "../readbackable"

export type Value = Partial<Readbackable> & {
  kind: string
}
