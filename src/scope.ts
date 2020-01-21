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

  lookup_value(name: string): undefined | Exp.Exp  {
    let named_entry = this.named_entries.find(([entry_name, _entry]) => name === entry_name)

    if (named_entry === undefined) {
      return undefined
    }

    let [ _name, entry ] = named_entry

    if (entry instanceof Entry.Let) {
      let { value } = entry
      return value
    }

    else if (entry instanceof Entry.Given) {
      return undefined
    }

    else if (entry instanceof Entry.Define) {
      let { value } = entry
      return value
    }

    else {
      throw new Error(
        "Scope.lookup_value fail\n" +
          `unhandled class of Scope.Entry: ${entry.constructor.name}\n`)
    }
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
