/**
 * left close, right open integer interval.
 */
export function* range(lo: number, hi: number) {
  let i = lo
  while (i < hi) {
    yield i
    i += 1
  }
}

export function* ranges(array: Array<[number, number]>) {
  for (let [lo, hi] of array) {
    for (let i of range(lo, hi)) {
      yield i
    }
  }
}
