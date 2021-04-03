import { Ctx } from "@/ctx"
import { Exp } from "@/exp"
import { Value } from "@/value"
import { Cls, Obj, TypeValue } from "@/core"
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
    if (t instanceof TypeValue) {
      const fulfilled = new Array()

      for (const { name, t, value } of this.fulfilled) {
        // fulfilled.push()
      }

      const demanded = new Array()

      // TODO this.telescope

      return new Cls(fulfilled, demanded)
    }
  }

  eta_expand(ctx: Ctx, value: Value): Exp {
    throw new Error("TODO")
  }

  dot(name: string): Value {
    for (const entry of this.fulfilled) {
      if (entry.name === name) {
        return entry.t
      }
    }

    return this.telescope.dot(name)
  }
}
