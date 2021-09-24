import * as ut from "../ut"

export function assert_equal(x: any, y: any): void {
  if (!ut.equal(x, y)) {
    throw new Error(
      [
        "I fail to assert equal, the following two values are not equal.",
        `x: ${JSON.stringify(x)}`,
        `y: ${JSON.stringify(y)}`,
      ].join("\n")
    )
  }
}
