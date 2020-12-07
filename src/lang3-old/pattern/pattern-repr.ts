import * as Pattern from "../pattern"

export function repr(pattern: Pattern.Pattern): string {
  switch (pattern.kind) {
    case "Pattern.v": {
      return pattern.name
    }
    case "Pattern.datatype": {
      return `${pattern.name}(${repr_args(pattern.args)})`
    }
    case "Pattern.data":
      return `${pattern.name}.${pattern.tag}(${repr_args(pattern.args)})`
  }
}

function repr_args(args: Array<Pattern.Pattern>): string {
  return args.map(Pattern.repr).join(", ")
}
