export function formatDate(t: Date): string {
  const YYYY = t.getFullYear()
  const MM = leftPadZero((t.getMonth() + 1).toString())
  const DD = leftPadZero(t.getDate().toString())

  return `${YYYY}-${MM}-${DD}`
}

function leftPadZero(s: string): string {
  return s.length === 1 ? "0" + s : s
}
