import { Readbackable } from "../../readbackable"
import { Value } from "../../value"
import * as Telescope from "../../value/telescope"
import { cls_readback_as } from "./cls-readback-as"

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
    readbackability: cls_readback_as(sat, tel),
  }
}
