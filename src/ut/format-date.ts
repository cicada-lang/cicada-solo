export function formatDate(t: Date): string {
  const YYYY = t.getFullYear()
  const MM = leftpad((t.getMonth() + 1).toString())
  const DD = leftpad(t.getDate().toString())

  return `${YYYY}-${MM}-${DD}`
}

function leftpad(s: string): string {
  return s.length === 1 ? "0" + s : s
}
