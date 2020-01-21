import * as Exp from "./exp"

export class Scope {
  constructor(
    public named_entries: Array<[string, Entry.Entry]> = [],
  ) {}

  get arity(): number {
    let n = 0
    for (let [_name, entry] of this.named_entries) {
      if (entry instanceof Entry.Given) {
        n += 1
      }
    }
    return n
  }
}

export namespace Entry {

  export abstract class Entry {}

  export class Let extends Entry {
    constructor(
      public value: Exp.Exp,
    ) { super() }
  }

  export class Given extends Entry {
    constructor(
      public t: Exp.Exp,
    ) { super() }
  }

  export class Define extends Entry {
    constructor(
      public t: Exp.Exp,
      public value: Exp.Exp,
    ) { super() }
  }

}
