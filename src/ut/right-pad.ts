export function rightPad(
  line: string,
  size: number,
  char: string = " ",
): string {
  return line + char.repeat(size - line.length)
}
