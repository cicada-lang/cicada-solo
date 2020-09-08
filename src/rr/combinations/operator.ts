import { create_regexp } from "../create-regexp"

export function seq(...res: Array<RegExp | string>): RegExp {
  return new RegExp(
    res
      .map(create_regexp)
      .map((re) => re.source)
      .join("")
  )
}

export function and(...res: Array<RegExp | string>): RegExp {
  return new RegExp(
    "(" +
      res
        .map(create_regexp)
        .map((re) => re.source)
        .join("") +
      ")"
  )
}

export function or(...res: Array<RegExp | string>): RegExp {
  return new RegExp(
    "(" +
      res
        .map(create_regexp)
        .map((re) => re.source)
        .join("|") +
      ")"
  )
}
