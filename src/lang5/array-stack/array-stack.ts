export type ArrayStack<A> = {
  values: Array<A>
  push: (value: A) => ArrayStack<A>
  drop: () => ArrayStack<A>
  top: () => A
  pop: () => [A, ArrayStack<A>]
}

export function ArrayStack<A>(values: Array<A>): ArrayStack<A> {
  return {
    values,
    push: (value) => ArrayStack([value, ...values]),
    drop: () => ArrayStack(values.slice(1)),
    top: () => values[0],
    pop: () => [values[0], ArrayStack(values.slice(1))],
  }
}
