import { zip } from "./zip"

export function array_equal<A>(
  xs: Array<A>,
  ys: Array<A>,
  eq: (x: A, y: A) => boolean
): boolean {
  if (xs.length !== ys.length) return false
  for (const [x, y] of zip(xs, ys)) {
    if (!eq(x, y)) return false
  }
  return true
}
