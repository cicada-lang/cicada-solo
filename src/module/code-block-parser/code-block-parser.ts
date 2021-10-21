import { CodeBlock } from "../code-block"

export abstract class CodeBlockParser {
  abstract parseCodeBlocks(text: string): Array<CodeBlock>
}
