import { create_regexp } from "../create-regexp"

export function lookahead(re: RegExp | string, x: RegExp | string): RegExp {
  re = create_regexp(re)
  x = create_regexp(x)
  return new RegExp(`${re.source}(?=${x.source})`)
}

export function negative_lookahead(
  re: RegExp | string,
  x: RegExp | string
): RegExp {
  re = create_regexp(re)
  x = create_regexp(x)
  return new RegExp(`${re.source}(?!${x.source})`)
}

export function lookbehind(x: RegExp | string, re: RegExp | string): RegExp {
  re = create_regexp(re)
  x = create_regexp(x)
  return new RegExp(`(?<=${x.source})${re.source}`)
}

export function negative_lookbehind(
  x: RegExp | string,
  re: RegExp | string
): RegExp {
  re = create_regexp(re)
  x = create_regexp(x)
  return new RegExp(`(?<!${x.source})${re.source}`)
}
