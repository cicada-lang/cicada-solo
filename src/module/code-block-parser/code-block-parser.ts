import { Stmt } from "../../stmt"
import { CodeBlock } from "../code-block"

export abstract class CodeBlockParser {
  abstract parse_code_blocks(text: string): Array<CodeBlock>

  parse_stmts(text: string): Array<Stmt> {
    return this.parse_code_blocks(text).flatMap(
      (code_block) => code_block.stmts
    )
  }
}
