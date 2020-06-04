import { nanoid } from "nanoid"

export function unique_name(base: string): string {
  let uuid: string = nanoid()
  return `${base}#${uuid}`
}
