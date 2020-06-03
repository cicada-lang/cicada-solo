import * as Value from "./value"

// NOTE maybe `Neutral` should not extends `Value`.

export abstract class Neutral extends Value.Value {}

export class Var extends Neutral {
  constructor(public name: string) {
    super()
  }
}

export class Ap extends Neutral {
  constructor(public target: Neutral, public args: Array<Value.Value>) {
    super()
  }
}

export class Dot extends Neutral {
  constructor(public target: Neutral, public field_name: string) {
    super()
  }
}

export class Transport extends Neutral {
  constructor(
    public equation: Neutral,
    public motive: Value.Value,
    public base: Value.Value
  ) {
    super()
  }
}
