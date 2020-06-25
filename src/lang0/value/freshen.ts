export function freshen(used: Set<string>, name: string): string {
  let counter = 1
  const base = name
  while (used.has(name)) {
    name = `${base}_${counter}`
  }
  return name
}
