import { leftPad } from "./left-pad"

export function formatTime(
  t: Date,
  opts?: { withMilliseconds?: boolean }
): string {
  const hh = leftPad(t.getHours().toString(), 2, "0")
  const mm = leftPad(t.getMinutes().toString(), 2, "0")
  const ss = leftPad(t.getSeconds().toString(), 2, "0")

  const mi = leftPad((t.getTime() % 1000).toString(), 3, "0")

  if (opts?.withMilliseconds) {
    return `${hh}:${mm}:${ss}.${mi}`
  } else {
    return `${hh}:${mm}:${ss}`
  }
}
