import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("1234567890abcdef", 16)

export class App {
  nanoid(): string {
    return nanoid()
  }
}
