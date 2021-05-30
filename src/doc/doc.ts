import { Stmt } from "../stmt"

// TODO

export abstract class Doc {
  abstract text: string
  abstract stmtGenerator: AsyncGenerator<Stmt>
}

// MdDoc
// CicDoc
