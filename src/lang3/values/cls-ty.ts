import { Ty } from "../ty"
import { Value } from "../value"
import * as Telescope from "../value/telescope"
import { cls_readback_as_type } from "./cls-readback-as-type"

export type ClsTy = Ty & {
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
    typed_readback(value, { mod, ctx }) {
      throw new Error("TODO")
    },
    readback_as_type: cls_readback_as_type(sat, tel),
  }
}
