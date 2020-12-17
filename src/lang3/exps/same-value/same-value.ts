import { Readbackable } from "../../readbackable"
import { Same } from "../same"

export type SameValue = Readbackable & {
  kind: "Value.same"
}

export const SameValue: SameValue = {
  kind: "Value.same",
  readback_as: (_) => Same,
}
