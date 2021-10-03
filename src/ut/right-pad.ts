export function rightPad(line: string, size: number): string {
  return line + " ".repeat(size - line.length)
}
