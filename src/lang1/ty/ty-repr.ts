import * as Ty from "../ty"

export function repr(t: Ty.Ty): string {
  switch (t.kind) {
    case "Ty.nat": {
      return "Nat"
    }
    case "Ty.arrow": {
      return `(${repr(t.arg_t)}) -> ${repr(t.ret_t)}`
    }
  }
}
