import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { TypeValue } from "@/core"
import { Telescope } from "@/telescope"
import { evaluate } from "@/evaluate"

export class ClsValue {
  fulfilled: Array<{ name: string; t: Value; value: Value }>
  telescope: Telescope

  constructor(
    fulfilled: Array<{ name: string; t: Value; value: Value }>,
    telescope: Telescope
  ) {
    this.fulfilled = fulfilled
    this.telescope = telescope
  }

  readback(ctx: Ctx, t: Value): Exp | undefined {
    throw new Error("TODO")
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    throw new Error("TODO")
  }
}
