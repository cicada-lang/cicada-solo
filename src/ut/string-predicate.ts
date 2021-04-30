export function blank_p(blank: string): boolean {
  const result = true
  for (let i = 0; i < blank.length; i++) {
    const char = blank[i]
    if (char !== " " && char !== "\t" && char !== "\n") {
      return false
    }
  }
  return result
}

export function empty_line_p(line: string): boolean {
  const result = true
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char !== " " && char !== "\t") {
      return false
    }
  }
  return result
}
