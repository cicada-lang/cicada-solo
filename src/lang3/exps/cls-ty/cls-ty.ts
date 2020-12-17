import { Value } from "../../value"
import * as Telescope from "../../value/telescope"
import { cls_readback_as_type } from "./cls-readback-as-type"
import { Readbackable } from "../../readbackable"

export type ClsTy = Readbackable & {
  kind: "Value.cls"
  sat: Array<{ name: string; t: Value; value: Value }>
  tel: Telescope.Telescope
}

export function ClsTy(
  sat: Array<{ name: string; t: Value; value: Value }>,
  tel: Telescope.Telescope
): ClsTy {
  return {
    kind: "Value.cls",
    sat,
    tel,
    ...cls_readback_as_type(sat, tel),
  }
}
