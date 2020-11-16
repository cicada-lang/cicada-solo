export type Source = file | repl

export type file = {
  kind: "Piece.Source.file"
  file: string
  code: string
}

export const file = (file: string, code: string): file => ({
  kind: "Piece.Source.file",
  file,
  code,
})

export type repl = {
  code: string
  kind: "Piece.Source.repl"
}

export const repl = (code: string): repl => ({
  kind: "Piece.Source.repl",
  code,
})
