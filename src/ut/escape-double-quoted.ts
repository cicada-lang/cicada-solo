export function escape_double_quoted(str: string): string {
  let s = ""
  for (const c of str) {
    if (c === '"') {
      s += "\\" + c
    } else {
      s += c
    }
  }

  return s
}
