import { leftPad } from "./left-pad"

export function formatDate(t: Date): string {
  const YYYY = t.getFullYear()
  const MM = leftPad((t.getMonth() + 1).toString(), 2, "0")
  const DD = leftPad(t.getDate().toString(), 2, "0")

  return `${YYYY}-${MM}-${DD}`
}
