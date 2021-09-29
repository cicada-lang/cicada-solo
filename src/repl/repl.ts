import { ParensChecker } from "./parens-checker"
import { CommonParensChecker } from "./common-parens-checker"

export type ReplEvent = {
  text: string
}

export abstract class ReplEventHandler {
  abstract greeting(): void
  abstract handle(event: ReplEvent): Promise<boolean>
}

export abstract class Repl {
  abstract handler: ReplEventHandler
  abstract run(): void
  parens_checker: ParensChecker = new CommonParensChecker()
}
