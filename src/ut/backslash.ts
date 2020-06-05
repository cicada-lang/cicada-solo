export function backslash_evaluate(str: string): string {
  let s = ""
  let i = 0

  while (i < str.length) {
    const head = str[i]
    if (head !== "\\") {
      s += head
      i++
    } else {
      const next = str[i + 1]
      if (next === undefined) break
      else if (next === "n") s += "\n"
      else if (next === "r") s += "\r"
      else if (next === "t") s += "\t"
      else if (next === "b") s += "\b"
      else if (next === "f") s += "\f"
      else if (next === "v") s += "\v"
      else s += next
      i++
      i++
    }
  }

  return s
}

export function backslash_escape(str: string): string {
  let s = ""
  let i = 0

  while (i < str.length) {
    const head = str[i]
    if (head === undefined) break
    else if (head === '"') s += "\\" + '"'
    else if (head === "\n") s += "\\n"
    else if (head === "\r") s += "\\r"
    else if (head === "\t") s += "\\t"
    else if (head === "\b") s += "\\b"
    else if (head === "\f") s += "\\f"
    else if (head === "\v") s += "\\v"
    else s += head
    i++
  }

  return s
}
