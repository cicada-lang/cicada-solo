export function formatTime(t: Date): string {
  const hh = leftpad(t.getHours().toString())
  const mm = leftpad(t.getMinutes().toString())
  const ss = leftpad(t.getSeconds().toString())

  return `${hh}:${mm}:${ss}`
}

function leftpad(s: string): string {
  return s.length === 1 ? "0" + s : s
}
