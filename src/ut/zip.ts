export function zip<A, B>(xs: Array<A>, ys: Array<B>): Array<[A, B]> {
  const zs: Array<[A, B]> = []
  if (xs.length < ys.length) {
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i]
      const y = ys[i]
      zs.push([x, y])
    }
  } else {
    for (let i = 0; i < ys.length; i++) {
      const x = xs[i]
      const y = ys[i]
      zs.push([x, y])
    }
  }
  return zs
}
