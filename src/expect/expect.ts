import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Trace } from "@/trace"
import { readback } from "@/readback"
import { TypeValue } from "@/core"

type Class<T> = new (...args: any[]) => T

export function expect<T>(ctx: Ctx, value: Value, TheClass: Class<T>): T {
  if (value instanceof TheClass) {
    return value
  } else {
    // TODO We can not always readback any value as `TypeValue`.
    //   this should be part of the error report.
    const exp = readback(ctx, new TypeValue(), value)
    const message =
      `I see unexpected value: ${exp.repr()}\n` +
      `But I am expecting value of type: ${TheClass.name}.\n`
    throw new Trace(message)
  }
}
