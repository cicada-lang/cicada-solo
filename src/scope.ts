import * as Exp from "./exp"

export class Scope {
  constructor(
    public named_entries: Array<[string, Entry.Entry]> = [],
  ) {}
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
