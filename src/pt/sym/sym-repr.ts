import * as Sym from "../sym"
import * as ut from "../../ut"

export function repr(sym: Sym.Sym): string {
  switch (sym.kind) {
    case "Sym.v": {
      const { name } = sym
      return name
    }
    case "Sym.ap": {
      const { target, args } = sym
      const head = repr(target)
      const body = args.map(repr).join(" ")
        return head + "(" + body + ")"
    }
    case "Sym.str": {
      const { value } = sym
      return JSON.stringify(value)
    }
  }
}
