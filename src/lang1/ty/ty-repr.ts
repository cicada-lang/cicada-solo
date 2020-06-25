import * as Ty from "../ty"

export function repr(t: Ty.Ty): string {
  switch (t.kind) {
    case "Ty.Nat": {
      return "Nat"
    }
    case "Ty.Arrow": {
      return `(${repr(t.arg)}) -> ${repr(t.ret)}`
    }
  }
}
