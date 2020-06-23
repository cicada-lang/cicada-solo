import * as ut from "./index"
import * as deep_diff from "deep-diff"

export function assert_equal(x: any, y: any): void {
  if (!ut.equal(x, y)) {
    throw Error(
      "assert_equal fail\n" +
        "the following two values are not equal\n" +
        `x: ${ut.inspect(x)}\n` +
        `y: ${ut.inspect(y)}\n` +
        `diff: ${ut.inspect(deep_diff.diff(x, y))}\n`
    )
  }
}
