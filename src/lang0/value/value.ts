import { Readbackable } from "../readbackable"

export type Value = Readbackable & {
  kind: string
}
