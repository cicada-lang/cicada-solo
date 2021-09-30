import { ReadlineRepl } from "./readline-repl"

export abstract class Command {
  abstract name: string
  abstract description: string
  abstract match(text: string): boolean
  abstract run(repl: ReadlineRepl, text: string): Promise<void>
}
