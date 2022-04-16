import { leftPad } from "./left-pad"

export function formatDate(t: Date | number): string {
  if (typeof t === "number") t = new Date(t)

  const YYYY = t.getFullYear()
  const MM = leftPad((t.getMonth() + 1).toString(), 2, "0")
  const DD = leftPad(t.getDate().toString(), 2, "0")

  return `${YYYY}-${MM}-${DD}`
}

export function formatTime(
  t: Date | number,
  opts?: { withMilliseconds?: boolean }
): string {
  if (typeof t === "number") t = new Date(t)

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

export function formatDateTime(
  t: Date | number,
  opts?: { withMilliseconds?: boolean }
): string {
  if (typeof t === "number") t = new Date(t)

  const date = formatDate(t)
  const time = formatTime(t, opts)

  return `${date} ${time}`
}
