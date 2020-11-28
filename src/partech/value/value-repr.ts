import * as Value from "../value"

export function repr(value: Value.Value): string {
  switch (value.kind) {
    case "Value.fn":
      return JSON.stringify(Value.present(value))
    case "Value.str": {
      return JSON.stringify(value.value)
    }
    case "Value.pattern": {
      return JSON.stringify([value.label])
    }
    case "Value.grammar":
      return value.name
  }
}
