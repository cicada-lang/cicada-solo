export function erase_comment(text: string): string {
  return text
    .split("\n")
    .map((line) => line_erase_comment(line))
    .join("\n")
}

function line_erase_comment(line: string): string {
  const i = line.indexOf("//")
  if (i === -1) {
    return line
  } else {
    const remain = line.slice(0, i)
    const erased = line.slice(i).replace(/./g, " ")
    return remain + erased
  }
}
