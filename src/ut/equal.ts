import fastDeepEqual from "fast-deep-equal"

// NOTE The module "fast-deep-equal": https://github.com/epoberezkin/fast-deep-equal
// Comparison details of Node's `assert.deepEqual()`:
//   https://nodejs.org/api/all.html#assert_assert_deepstrictequal_actual_expected_message
export function equal(x: any, y: any): boolean {
  return fastDeepEqual(x, y)
}
