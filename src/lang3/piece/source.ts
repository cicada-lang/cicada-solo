export type Source = file | repl

export type file = {
  kind: "file"
  code: string
  name: string
}

export type repl = {
  code: string
  kind: "repl"
}
