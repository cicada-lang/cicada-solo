import { CodeBlock } from "../code-block"

export abstract class CodeBlockParser {
  abstract parse_code_blocks(text: string): Array<CodeBlock>
}
