export function add_flag(reg: RegExp, flags: string): RegExp {
  return new RegExp(reg, reg.flags + flags)
}

export const flags = {
  global: "g",
  ignoreCase: "i",
  multiline: "m",
  dotAll: "s",
  unicode: "u",
  sticky: "y",
}
