export abstract class Highlighter {
  abstract highlight(tag: string, text: string): string
}

export class SimpleHighlighter extends Highlighter {
  highlight: (tag: string, text: string) => string

  constructor(opts: { highlight: (tag: string, text: string) => string }) {
    super()
    this.highlight = opts.highlight
  }

  static create(opts: {
    highlight: (tag: string, text: string) => string
  }): SimpleHighlighter {
    return new SimpleHighlighter(opts)
  }
}
