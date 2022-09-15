export function freshen(used: Set<string>, name: string): string {
  let counter = 1
  let new_name = name
  while (true) {
    if (used.has(new_name)) {
      new_name = `${name}${counter}`
      counter++
    } else {
      return new_name
    }
  }
}
