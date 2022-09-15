export function leftPad(
  line: string,
  size: number,
  char: string = " ",
): string {
  return char.repeat(size - line.length) + line
}
