export function aline(text: string): string {
  return (
    text
      .split("\n")
      .map((s) => s.trimStart())
      // NOTE ignore non | lines
      .filter((s) => s.startsWith("|"))
      .map((s) => s.slice(1))
      .map((s) => s + "\n")
      .join("")
  )
}
