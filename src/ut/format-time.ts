export function formatTime(t: Date): string {
  const hh = leftPadZero(t.getHours().toString())
  const mm = leftPadZero(t.getMinutes().toString())
  const ss = leftPadZero(t.getSeconds().toString())

  return `${hh}:${mm}:${ss}`
}

function leftPadZero(s: string): string {
  return s.length === 1 ? "0" + s : s
}
