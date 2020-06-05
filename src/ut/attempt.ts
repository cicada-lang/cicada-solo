export abstract class Attempt<A> {
  abstract_class_name: "Attempt" = "Attempt"
}

export class Success<A> extends Attempt<A> {
  constructor(public value: A) {
    super()
  }
}
export class Fail<A> extends Attempt<A> {
  constructor(public error: Error) {
    super()
  }
}

export function run<A>(f: () => A): Attempt<A> {
  try {
    return new Success(f())
  } catch (error) {
    return new Fail(error)
  }
}
