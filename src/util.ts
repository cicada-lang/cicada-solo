// import nanoid from "nanoid"
import generate from "nanoid/generate"

export function unique_name(base: string): string {
  // let uuid: string = nanoid()
  let uuid: string = generate("123456789", 5)
  return `${base}#${uuid}`
}
