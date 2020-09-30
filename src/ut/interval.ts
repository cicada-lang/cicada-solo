// NOTE [x0, x1] not overlap with [y0, y1]
export function interval_not_overlap_p(
  x0: number,
  x1: number,
  y0: number,
  y1: number
): boolean {
  return y0 > x1 || y1 < x0
}

// NOTE [x0, x1] overlap with [y0, y1]
export function interval_overlap_p(
  x0: number,
  x1: number,
  y0: number,
  y1: number
): boolean {
  return !interval_not_overlap_p(x0, x1, y0, y1)
}
