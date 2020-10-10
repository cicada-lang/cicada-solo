export function aline(text: string): string {
  const lines = []
  for (const line of text.split("\n")) {
    if (line.trimStart().startsWith("|")) {
      lines.push(line.trimStart().slice(1))
    } else {
      lines.push(line)
    }
  }
  return lines.join("\n")
}
