export type Stack<A> = {
  values: Array<A>
  push: (value: A) => Stack<A>
  drop: () => Stack<A>
  tos: () => A
  pop: () => [A, Stack<A>]
}

export function Stack<A>(values: Array<A>): Stack<A> {
  return {
    values,
    push: (value) => Stack([value, ...values]),
    drop: () => Stack(values.slice(1)),
    tos: () => values[0],
    pop: () => [values[0], Stack(values.slice(1))],
  }
}
