import { create_regexp } from "../create-regexp"

export function zero_or_more(re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(re.source + "*")
}

export function one_or_more(re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(re.source + "+")
}

export function optional(re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(re.source + "?")
}

export function exactly(n: number, re: RegExp | string): RegExp {
  re = create_regexp(re)
  if (Number.isInteger(n) && n > 0) {
    return new RegExp(re.source + `{${n}}`)
  } else {
    throw new Error("expecting positive integer")
  }
}

export function at_least(n: number, re: RegExp | string): RegExp {
  re = create_regexp(re)
  if (Number.isInteger(n) && n > 0) {
    return new RegExp(re.source + `{${n},}`)
  } else {
    throw new Error("expecting positive integer")
  }
}

export function at_least_at_most(
  n: number,
  m: number,
  re: RegExp | string
): RegExp {
  re = create_regexp(re)
  if (Number.isInteger(n) && n >= 0 && Number.isInteger(m) && m > n) {
    return new RegExp(re.source + `{${n},${m}}`)
  } else {
    throw new Error(
      "expecting n to be zero or positive integer and m > n\n" +
        `n: ${n}\n` +
        `m: ${m}\n`
    )
  }
}

export function non_greedy(re: RegExp | string): RegExp {
  re = create_regexp(re)
  if (re.source.length === 0) {
    throw new Error("Empty RegExp source")
  } else if (
    re.source[re.source.length - 1] === "*" ||
    re.source[re.source.length - 1] === "+" ||
    re.source[re.source.length - 1] === "?" ||
    re.source[re.source.length - 1] === "}"
  ) {
    return new RegExp(re.source + "?")
  } else {
    throw new Error("Expecting quantifier\n" + `source: ${re.source}\n`)
  }
}
