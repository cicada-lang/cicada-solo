import { create_regexp } from "../create-regexp"

export function group(re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(`(${re.source})`)
}

export function non_capturing_group(re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(`(?:${re.source})`)
}

export function named_group(name: string, re: RegExp | string): RegExp {
  re = create_regexp(re)
  return new RegExp(`(?<${name}>${re.source})`)
}
