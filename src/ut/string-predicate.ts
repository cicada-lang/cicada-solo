export function blank_p(blank: string): boolean {
  let result = true
  for (let i = 0; i < blank.length; i++) {
    let char = blank[i]
    if (char !== " " && char !== "\t" && char !== "\n") {
      return false
    }
  }
  return result
}

export function empty_line_p(line: string): boolean {
  let result = true
  for (let i = 0; i < line.length; i++) {
    let char = line[i]
    if (char !== " " && char !== "\t") {
      return false
    }
  }
  return result
}
